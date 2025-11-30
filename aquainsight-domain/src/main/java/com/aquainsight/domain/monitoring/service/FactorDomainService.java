package com.aquainsight.domain.monitoring.service;

import com.aquainsight.domain.monitoring.entity.DeviceModel;
import com.aquainsight.domain.monitoring.entity.Factor;
import com.aquainsight.domain.monitoring.repository.DeviceModelRepository;
import com.aquainsight.domain.monitoring.repository.FactorRepository;
import com.baomidou.mybatisplus.core.metadata.IPage;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

/**
 * 监测因子领域服务
 */
@Service
@RequiredArgsConstructor
public class FactorDomainService {

    private final FactorRepository factorRepository;
    private final DeviceModelRepository deviceModelRepository;

    /**
     * 创建监测因子
     */
    public Factor createFactor(String factorCode, String nationalCode, String factorName, String shortName,
                              Integer deviceModelId, String category, String unit,
                              BigDecimal upperLimit, BigDecimal lowerLimit, Integer precisionDigits) {
        // 领域规则验证
        if (factorCode == null || factorCode.trim().isEmpty()) {
            throw new IllegalArgumentException("因子代码不能为空");
        }
        if (factorName == null || factorName.trim().isEmpty()) {
            throw new IllegalArgumentException("因子名称不能为空");
        }
        if (deviceModelId == null) {
            throw new IllegalArgumentException("所属设备型号不能为空");
        }
        if (factorRepository.existsByFactorCode(factorCode)) {
            throw new IllegalArgumentException("因子代码已存在");
        }

        // 获取设备型号领域对象
        DeviceModel deviceModel = deviceModelRepository.findById(deviceModelId)
                .orElseThrow(() -> new IllegalArgumentException("所属设备型号不存在"));

        Factor factor = Factor.builder()
                .factorCode(factorCode)
                .nationalCode(nationalCode)
                .factorName(factorName)
                .shortName(shortName)
                .deviceModel(deviceModel)
                .category(category)
                .unit(unit)
                .upperLimit(upperLimit)
                .lowerLimit(lowerLimit)
                .precisionDigits(precisionDigits == null ? 2 : precisionDigits)
                .createTime(LocalDateTime.now())
                .updateTime(LocalDateTime.now())
                .deleted(0)
                .build();

        return factorRepository.save(factor);
    }

    /**
     * 更新监测因子信息
     */
    public Factor updateFactorInfo(Integer factorId, String factorName, String shortName, String category,
                                  String unit, BigDecimal upperLimit, BigDecimal lowerLimit, Integer precisionDigits) {
        Optional<Factor> factorOpt = factorRepository.findById(factorId);
        if (!factorOpt.isPresent()) {
            throw new IllegalArgumentException("监测因子不存在");
        }

        Factor factor = factorOpt.get();
        factor.updateInfo(factorName, shortName, category, unit, upperLimit, lowerLimit, precisionDigits);
        return factorRepository.update(factor);
    }

    /**
     * 根据ID获取监测因子
     */
    public Optional<Factor> getFactorById(Integer factorId) {
        return factorRepository.findById(factorId);
    }

    /**
     * 根据类别获取监测因子
     */
    public List<Factor> getFactorsByCategory(String category) {
        return factorRepository.findByCategory(category);
    }

    /**
     * 获取所有监测因子
     */
    public List<Factor> getAllFactors() {
        return factorRepository.findAll();
    }

    /**
     * 删除监测因子
     */
    public boolean deleteFactor(Integer factorId) {
        Optional<Factor> factorOpt = factorRepository.findById(factorId);
        if (!factorOpt.isPresent()) {
            throw new IllegalArgumentException("监测因子不存在");
        }
        return factorRepository.deleteById(factorId);
    }

    /**
     * 分页查询监测因子
     */
    public IPage<Factor> getFactorPage(Integer pageNum, Integer pageSize, String category) {
        return factorRepository.findPage(pageNum, pageSize, category);
    }
}
