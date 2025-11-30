package com.aquainsight.domain.maintenance.service;

import com.aquainsight.domain.maintenance.entity.Scheme;
import com.aquainsight.domain.maintenance.entity.SchemeItem;
import com.aquainsight.domain.maintenance.repository.SchemeRepository;
import com.aquainsight.domain.maintenance.repository.SchemeItemRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

/**
 * 方案领域服务
 */
@Service
@RequiredArgsConstructor
public class SchemeDomainService {

    private final SchemeRepository schemeRepository;
    private final SchemeItemRepository schemeItemRepository;

    /**
     * 创建方案
     */
    public Scheme createScheme(String name, String code, String creator) {
        // 领域规则验证
        if (name == null || name.trim().isEmpty()) {
            throw new IllegalArgumentException("方案名称不能为空");
        }
        if (code == null || code.trim().isEmpty()) {
            throw new IllegalArgumentException("方案编码不能为空");
        }

        // 检查编码是否已存在
        Scheme existingScheme = schemeRepository.findByCode(code);
        if (existingScheme != null) {
            throw new IllegalArgumentException("方案编码已存在");
        }

        Scheme scheme = Scheme.builder()
                .name(name)
                .code(code)
                .creator(creator)
                .createTime(LocalDateTime.now())
                .updateTime(LocalDateTime.now())
                .deleted(0)
                .build();

        return schemeRepository.save(scheme);
    }

    /**
     * 更新方案信息
     */
    public Scheme updateSchemeInfo(Integer schemeId, String name, String updater) {
        Scheme scheme = schemeRepository.findById(schemeId);
        if (scheme == null) {
            throw new IllegalArgumentException("方案不存在");
        }

        scheme.updateInfo(name, updater);
        return schemeRepository.save(scheme);
    }

    /**
     * 根据ID获取方案
     */
    public Scheme getSchemeById(Integer schemeId) {
        return schemeRepository.findById(schemeId);
    }

    /**
     * 根据ID获取方案（包含方案项目）
     */
    public Scheme getSchemeByIdWithItems(Integer schemeId) {
        return schemeRepository.findByIdWithItems(schemeId);
    }

    /**
     * 获取所有方案
     */
    public List<Scheme> getAllSchemes() {
        return schemeRepository.findAll();
    }

    /**
     * 根据名称模糊查询
     */
    public List<Scheme> searchSchemesByName(String name) {
        if (name == null || name.trim().isEmpty()) {
            return schemeRepository.findAll();
        }
        return schemeRepository.findByNameLike(name);
    }

    /**
     * 删除方案
     */
    public void deleteScheme(Integer schemeId) {
        Scheme scheme = schemeRepository.findById(schemeId);
        if (scheme == null) {
            throw new IllegalArgumentException("方案不存在");
        }
        // 删除方案时，同时删除方案项目
        schemeItemRepository.deleteBySchemeId(schemeId);
        schemeRepository.deleteById(schemeId);
    }

    /**
     * 批量删除方案
     */
    public void deleteSchemes(List<Integer> ids) {
        if (ids == null || ids.isEmpty()) {
            throw new IllegalArgumentException("删除的ID列表不能为空");
        }
        // 删除所有方案的方案项目
        for (Integer id : ids) {
            schemeItemRepository.deleteBySchemeId(id);
        }
        schemeRepository.deleteByIds(ids);
    }

    /**
     * 添加方案项目
     */
    public SchemeItem addSchemeItem(Integer schemeId, SchemeItem schemeItem) {
        Scheme scheme = schemeRepository.findById(schemeId);
        if (scheme == null) {
            throw new IllegalArgumentException("方案不存在");
        }
        schemeItem.setSchemeId(schemeId);
        schemeItem.setCreateTime(LocalDateTime.now());
        schemeItem.setUpdateTime(LocalDateTime.now());
        schemeItem.setDeleted(0);
        return schemeItemRepository.save(schemeItem);
    }

    /**
     * 更新方案项目
     */
    public SchemeItem updateSchemeItem(SchemeItem schemeItem) {
        SchemeItem existingItem = schemeItemRepository.findById(schemeItem.getId());
        if (existingItem == null) {
            throw new IllegalArgumentException("方案项目不存在");
        }
        return schemeItemRepository.save(schemeItem);
    }

    /**
     * 删除方案项目
     */
    public void deleteSchemeItem(Integer schemeItemId) {
        SchemeItem schemeItem = schemeItemRepository.findById(schemeItemId);
        if (schemeItem == null) {
            throw new IllegalArgumentException("方案项目不存在");
        }
        schemeItemRepository.deleteById(schemeItemId);
    }

    /**
     * 获取方案的所有项目
     */
    public List<SchemeItem> getSchemeItems(Integer schemeId) {
        return schemeItemRepository.findBySchemeId(schemeId);
    }
}
