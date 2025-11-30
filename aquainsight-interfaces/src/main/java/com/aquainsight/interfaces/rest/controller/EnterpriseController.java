package com.aquainsight.interfaces.rest.controller;

import com.aquainsight.application.service.EnterpriseApplicationService;
import com.aquainsight.common.util.PageResult;
import com.aquainsight.common.util.Response;
import com.aquainsight.domain.monitoring.entity.Enterprise;
import com.aquainsight.interfaces.rest.dto.CreateEnterpriseRequest;
import com.aquainsight.interfaces.rest.dto.UpdateEnterpriseRequest;
import com.aquainsight.interfaces.rest.vo.EnterpriseVO;
import com.baomidou.mybatisplus.core.metadata.IPage;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

/**
 * 企业控制器
 *
 * @author aquainsight
 */
@RestController
@RequestMapping("/api/enterprises")
@RequiredArgsConstructor
public class EnterpriseController {

    private final EnterpriseApplicationService enterpriseApplicationService;

    private static final DateTimeFormatter DATE_FORMATTER = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");

    /**
     * 创建企业
     */
    @PostMapping
    public Response<EnterpriseVO> createEnterprise(@Valid @RequestBody CreateEnterpriseRequest request) {
        try {
            Enterprise enterprise = enterpriseApplicationService.createEnterprise(
                    request.getEnterpriseName(),
                    request.getEnterpriseCode(),
                    request.getEnterpriseTag(),
                    request.getContactPerson(),
                    request.getContactPhone(),
                    request.getAddress(),
                    request.getDescription()
            );
            return Response.success(convertToVO(enterprise));
        } catch (Exception e) {
            return Response.error(e.getMessage());
        }
    }

    /**
     * 更新企业
     */
    @PutMapping("/{id}")
    public Response<EnterpriseVO> updateEnterprise(@PathVariable Integer id,
                                                   @RequestBody UpdateEnterpriseRequest request) {
        try {
            Enterprise enterprise = enterpriseApplicationService.updateEnterpriseInfo(
                    id,
                    request.getEnterpriseName(),
                    request.getEnterpriseTag(),
                    request.getContactPerson(),
                    request.getContactPhone(),
                    request.getAddress(),
                    request.getDescription()
            );
            return Response.success(convertToVO(enterprise));
        } catch (Exception e) {
            return Response.error(e.getMessage());
        }
    }

    /**
     * 获取企业详情
     */
    @GetMapping("/{id}")
    public Response<EnterpriseVO> getEnterpriseById(@PathVariable Integer id) {
        try {
            Optional<Enterprise> enterpriseOpt = enterpriseApplicationService.getEnterpriseById(id);
            if (!enterpriseOpt.isPresent()) {
                return Response.error("企业不存在");
            }
            return Response.success(convertToVO(enterpriseOpt.get()));
        } catch (Exception e) {
            return Response.error(e.getMessage());
        }
    }

    /**
     * 分页获取企业列表
     */
    @GetMapping
    public Response<PageResult<EnterpriseVO>> listEnterprises(
            @RequestParam(defaultValue = "1") Integer pageNum,
            @RequestParam(defaultValue = "10") Integer pageSize,
            @RequestParam(required = false) String enterpriseName,
            @RequestParam(required = false) String enterpriseTag) {
        try {
            IPage<Enterprise> page = enterpriseApplicationService.getEnterprisePage(
                    pageNum, pageSize, enterpriseName, enterpriseTag
            );

            List<EnterpriseVO> voList = page.getRecords().stream()
                    .map(this::convertToVO)
                    .collect(Collectors.toList());

            PageResult<EnterpriseVO> result = PageResult.of(voList, page.getTotal(), pageNum, pageSize);
            return Response.success(result);
        } catch (Exception e) {
            return Response.error(e.getMessage());
        }
    }

    /**
     * 获取所有企业(不分页)
     */
    @GetMapping("/all")
    public Response<List<EnterpriseVO>> getAllEnterprises() {
        try {
            List<Enterprise> enterprises = enterpriseApplicationService.getAllEnterprises();
            List<EnterpriseVO> voList = enterprises.stream()
                    .map(this::convertToVO)
                    .collect(Collectors.toList());
            return Response.success(voList);
        } catch (Exception e) {
            return Response.error(e.getMessage());
        }
    }

    /**
     * 删除企业
     */
    @DeleteMapping("/{id}")
    public Response<Void> deleteEnterprise(@PathVariable Integer id) {
        try {
            enterpriseApplicationService.deleteEnterprise(id);
            return Response.success();
        } catch (Exception e) {
            return Response.error(e.getMessage());
        }
    }

    /**
     * 将企业实体转换为VO
     */
    private EnterpriseVO convertToVO(Enterprise enterprise) {
        Long siteCount = enterpriseApplicationService.countEnterpriseSites(enterprise.getId());
        return EnterpriseVO.builder()
                .id(enterprise.getId())
                .enterpriseName(enterprise.getEnterpriseName())
                .enterpriseCode(enterprise.getEnterpriseCode())
                .enterpriseTag(enterprise.getEnterpriseTag())
                .contactPerson(enterprise.getContactPerson())
                .contactPhone(enterprise.getContactPhone())
                .address(enterprise.getAddress())
                .description(enterprise.getDescription())
                .siteCount(siteCount)
                .createTime(enterprise.getCreateTime() != null ? enterprise.getCreateTime().format(DATE_FORMATTER) : null)
                .updateTime(enterprise.getUpdateTime() != null ? enterprise.getUpdateTime().format(DATE_FORMATTER) : null)
                .build();
    }
}
