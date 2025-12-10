package com.aquainsight.domain.maintenance.service;

import com.aquainsight.domain.maintenance.entity.StepTemplate;
import com.aquainsight.domain.maintenance.repository.StepTemplateRepository;
import com.aquainsight.domain.maintenance.types.StepParameter;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

/**
 * 步骤模版领域服务
 */
@Service
@RequiredArgsConstructor
public class StepTemplateDomainService {

    private final StepTemplateRepository stepTemplateRepository;

    /**
     * 创建步骤模版
     */
    public StepTemplate createStepTemplate(String name, String code, List<StepParameter> parameters,
                                        Integer overdueDays, String description) {
        // 领域规则验证
        if (name == null || name.trim().isEmpty()) {
            throw new IllegalArgumentException("名称不能为空");
        }
        if (code == null || code.trim().isEmpty()) {
            throw new IllegalArgumentException("编码不能为空");
        }

        // 检查编码是否已存在
        StepTemplate existingStepTemplate = stepTemplateRepository.findByCode(code);
        if (existingStepTemplate != null) {
            throw new IllegalArgumentException("编码已存在");
        }

        StepTemplate stepTemplate = StepTemplate.builder()
                .name(name)
                .code(code)
                .parameters(parameters)
                .overdueDays(overdueDays == null ? 0 : overdueDays)
                .description(description)
                .createTime(LocalDateTime.now())
                .updateTime(LocalDateTime.now())
                .deleted(0)
                .build();

        return stepTemplateRepository.save(stepTemplate);
    }

    /**
     * 更新步骤模版信息
     */
    public StepTemplate updateStepTemplateInfo(Integer stepTemplateId, String name, List<StepParameter> parameters,
                                            Integer overdueDays, String description) {
        StepTemplate stepTemplate = stepTemplateRepository.findById(stepTemplateId);
        if (stepTemplate == null) {
            throw new IllegalArgumentException("步骤模版不存在");
        }

        stepTemplate.updateInfo(name, parameters, overdueDays, description);
        return stepTemplateRepository.save(stepTemplate);
    }

    /**
     * 根据ID获取步骤模版
     */
    public StepTemplate getStepTemplateById(Integer stepTemplateId) {
        return stepTemplateRepository.findById(stepTemplateId);
    }

    /**
     * 根据编码获取步骤模版
     */
    public StepTemplate getStepTemplateByCode(String code) {
        return stepTemplateRepository.findByCode(code);
    }

    /**
     * 获取所有步骤模版
     */
    public List<StepTemplate> getAllJobCategories() {
        return stepTemplateRepository.findAll();
    }

    /**
     * 根据名称模糊查询
     */
    public List<StepTemplate> searchJobCategoriesByName(String name) {
        if (name == null || name.trim().isEmpty()) {
            return stepTemplateRepository.findAll();
        }
        return stepTemplateRepository.findByNameLike(name);
    }

    /**
     * 删除步骤模版
     */
    public void deleteStepTemplate(Integer stepTemplateId) {
        StepTemplate stepTemplate = stepTemplateRepository.findById(stepTemplateId);
        if (stepTemplate == null) {
            throw new IllegalArgumentException("步骤模版不存在");
        }
        stepTemplateRepository.deleteById(stepTemplateId);
    }

    /**
     * 批量删除步骤模版
     */
    public void deleteJobCategories(List<Integer> ids) {
        if (ids == null || ids.isEmpty()) {
            throw new IllegalArgumentException("删除的ID列表不能为空");
        }
        stepTemplateRepository.deleteByIds(ids);
    }
}
