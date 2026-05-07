import React, { memo, useCallback, useMemo, useState } from 'react'
import { useMutation, useQuery } from 'react-query'
import { requests } from '@utils/requests'
import { Box } from '@mui/material'
import { CheckSquare, ChevronDown, ChevronRight, InfoIcon, MinusSquare, Square } from 'lucide-react'
import StyledTooltip from '@components/StyledTooltip'
import { error, success } from '@utils/toast'

const stickyHeaderTop = 0

function InteractiveCheckbox({ state = 'none', onClick, disabled }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      style={{ background: 'none', border: 'none', cursor: disabled ? 'default' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: disabled ? 0.5 : 1 }}
    >
      {state === 'all' && <CheckSquare size={18} color='#1976d2' />}
      {state === 'some' && <MinusSquare size={18} color='#1976d2' />}
      {state === 'none' && <Square size={18} color='#ccc' />}
    </button>
  )
}

const PermissionGroupSection = memo(function PermissionGroupSection({
  checkedPermissionsByRole,
  group,
  isLastGroup,
  isOpen,
  onToggle,
  roles,
  onTogglePermission,
  loadingCell,
}) {
  const groupBorder = isLastGroup ? 'none' : '2px solid #ddd'

  return (
    <>
      <tr>
        <td
          style={{
            padding: 12,
            fontWeight: 700,
            position: 'sticky',
            left: 0,
            background: '#fff',
            zIndex: 4,
            borderBottom: groupBorder,
            display: 'flex',
            alignItems: 'center',
            borderRadius: isLastGroup ? '0 0 16px 16px' : ' 0',
            gap: 8,
          }}
        >
          {group.permissions.length > 0 && (
            <button onClick={() => onToggle(group.id)} style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
              {isOpen ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
            </button>
          )}
          <div style={{ fontSize: 16, display: 'flex', alignItems: 'center' }}>
            {group.name}
            <StyledTooltip title={group?.description || 'No'}>
              <InfoIcon size={14} color='#999' style={{ marginLeft: 6 }} />
            </StyledTooltip>
          </div>
        </td>

        {roles.map((role) => (
          <td key={role.id} style={{ padding: 12, textAlign: 'center', borderBottom: groupBorder }} />
        ))}
      </tr>

      {isOpen &&
        group.permissions.map((permission) => (
          <React.Fragment key={permission.id}>
            <tr>
              <td
                style={{
                  padding: 12,
                  fontWeight: 600,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  position: 'sticky',
                  left: 0,
                  background: '#fff',
                  height: 50,
                  zIndex: 3,
                  borderBottom: '1px solid #eee',
                }}
              >
                <div style={{ width: 20 }} />
                <div>
                  <div style={{ fontSize: 16, display: 'flex', alignItems: 'center' }}>
                    {permission.name}
                    <StyledTooltip title={permission?.description || 'No'}>
                      <InfoIcon size={14} color='#999' style={{ marginLeft: 6 }} />
                    </StyledTooltip>
                  </div>
                </div>
              </td>

              {roles.map((role) => {
                const isLoading = loadingCell?.roleId === role.id && loadingCell?.permissionId === permission.id
                const state =
                  permission.children.length > 0
                    ? permission.childStateByRole[role.id]
                    : checkedPermissionsByRole[role.id]?.has(permission.id)
                    ? 'all'
                    : 'none'
                return (
                  <td key={role.id} style={{ padding: 12, height: 50, textAlign: 'center', borderBottom: '1px solid #eee' }}>
                    <InteractiveCheckbox
                      state={state}
                      disabled={isLoading}
                      onClick={() => onTogglePermission({ role, permission, isChild: false })}
                    />
                  </td>
                )
              })}
            </tr>

            {permission.children.map((child) => (
              <tr key={child.id}>
                <td
                  style={{
                    padding: 12,
                    paddingLeft: 52,
                    borderBottom: '1px solid #f3f3f3',
                    position: 'sticky',
                    left: 0,
                    height: 50,
                    background: '#fff',
                    zIndex: 2,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 8,
                  }}
                >
                  {child.name}
                  <StyledTooltip title={child?.description || 'No'}>
                    <InfoIcon size={14} color='#999' style={{ marginLeft: 6 }} />
                  </StyledTooltip>
                </td>
                {roles.map((role) => {
                  const isLoading = loadingCell?.roleId === role.id && loadingCell?.permissionId === child.id
                  return (
                    <td key={role.id} style={{ padding: 12, textAlign: 'center', borderBottom: '1px solid #f3f3f3' }}>
                      <InteractiveCheckbox
                        state={checkedPermissionsByRole[role.id]?.has(child.id) ? 'all' : 'none'}
                        disabled={isLoading}
                        onClick={() => onTogglePermission({ role, permission: child, isChild: true, parentPermission: permission })}
                      />
                    </td>
                  )
                })}
              </tr>
            ))}
          </React.Fragment>
        ))}
    </>
  )
})

function buildPermissionsPayload(checkedSet, allPermissionGroups) {
  const permissions = []
  allPermissionGroups.forEach((group) => {
    group.permissions.forEach((permission) => {
      const isParentChecked = checkedSet.has(permission.id)
      const checkedChildren = permission.children.filter((child) => checkedSet.has(child.id)).map((child) => child.id)

      if (isParentChecked || checkedChildren.length > 0) {
        permissions.push({
          parent_id: permission.id,
          children_ids: checkedChildren,
          is_active: isParentChecked,
        })
      }
    })
  })
  return permissions
}

function RollReportPage() {
  const { data: rolesList, isLoading: rolesLoading } = useQuery(['rolesList'], () => requests.getAllRoles({ limit: 100 }))
  const { data: permissionsWithRoles, isLoading: permsLoading } = useQuery(['permissionsWithRoles'], () => requests.getAllPermissionsWithRoles({ limit: 100 }))
  const [openGroups, setOpenGroups] = useState({})
  const [localChecked, setLocalChecked] = useState(null)
  const [loadingCell, setLoadingCell] = useState(null)

  const roles = useMemo(() => rolesList?.data?.data?.data || [], [rolesList])
  const rawGroups = permissionsWithRoles?.data?.data?.data || []

  const { checkedPermissionsByRole, allPermissionGroups } = useMemo(() => {
    const nextCheckedPermissionsByRole = {}
    roles.forEach((role) => {
      nextCheckedPermissionsByRole[role.id] = new Set()
    })

    const nextGroups = rawGroups.map((group) => ({
      id: group.id,
      key: group.key,
      name: group.name,
      description: group.description,
      permissions: (group.permissions || []).map((permission) => {
        const permissionRoleIds = Array.isArray(permission.roles) ? permission.roles.map((role) => role.id) : []
        permissionRoleIds.forEach((roleId) => {
          nextCheckedPermissionsByRole[roleId]?.add(permission.id)
        })

        const children = (permission.children || []).map((child) => {
          const childRoleIds = Array.isArray(child.roles) ? child.roles.map((role) => role.id) : []
          childRoleIds.forEach((roleId) => {
            nextCheckedPermissionsByRole[roleId]?.add(child.id)
          })

          return {
            id: child.id,
            name: child.name,
            description: child.description,
            roleIds: childRoleIds,
          }
        })

        const childStateByRole = {}
        if (children.length > 0) {
          roles.forEach((role) => {
            let checkedCount = 0
            children.forEach((child) => {
              if (child.roleIds.includes(role.id)) checkedCount += 1
            })

            if (checkedCount === 0) childStateByRole[role.id] = 'none'
            else if (checkedCount === children.length) childStateByRole[role.id] = 'all'
            else childStateByRole[role.id] = 'some'
          })
        }

        return {
          id: permission.id,
          name: permission.name,
          children,
          childStateByRole,
          description: permission.description,
        }
      }),
    }))

    return {
      checkedPermissionsByRole: nextCheckedPermissionsByRole,
      allPermissionGroups: nextGroups,
    }
  }, [rawGroups, roles])

  const effectiveChecked = localChecked || checkedPermissionsByRole

  const { mutate: editRole } = useMutation(requests.editRole)

  const handleTogglePermission = useCallback(
    ({ role, permission }) => {
      const roleId = role.id
      const permId = permission.id

      const currentSet = new Set(effectiveChecked[roleId] || [])
      const wasChecked = currentSet.has(permId)

      const optimisticChecked = {}
      Object.keys(effectiveChecked).forEach((rid) => {
        optimisticChecked[rid] = new Set(effectiveChecked[rid])
      })

      if (wasChecked) {
        optimisticChecked[roleId].delete(permId)
      } else {
        optimisticChecked[roleId].add(permId)
      }

      setLocalChecked(optimisticChecked)
      setLoadingCell({ roleId, permissionId: permId })

      const newSet = optimisticChecked[roleId]
      const permissions = buildPermissionsPayload(newSet, allPermissionGroups)

      editRole(
        { id: roleId, data: { name: role.name, description: role.name, permissions } },
        {
          onSuccess: () => {
            success('Сохранено')
            setLoadingCell(null)
          },
          onError: () => {
            error('Ошибка сохранения')
            const revertChecked = {}
            Object.keys(optimisticChecked).forEach((rid) => {
              revertChecked[rid] = new Set(optimisticChecked[rid])
            })
            if (wasChecked) {
              revertChecked[roleId].add(permId)
            } else {
              revertChecked[roleId].delete(permId)
            }
            setLocalChecked(revertChecked)
            setLoadingCell(null)
          },
        }
      )
    },
    [effectiveChecked, allPermissionGroups, editRole]
  )

  const toggleOpenGroup = useCallback((groupId) => {
    setOpenGroups((prev) => ({ ...prev, [groupId]: !prev[groupId] }))
  }, [])

  const computedGroups = useMemo(() => {
    if (!localChecked) return allPermissionGroups

    return allPermissionGroups.map((group) => ({
      ...group,
      permissions: group.permissions.map((permission) => {
        const childStateByRole = {}
        if (permission.children.length > 0) {
          roles.forEach((role) => {
            let checkedCount = 0
            permission.children.forEach((child) => {
              if (localChecked[role.id]?.has(child.id)) checkedCount += 1
            })

            if (checkedCount === 0) childStateByRole[role.id] = 'none'
            else if (checkedCount === permission.children.length) childStateByRole[role.id] = 'all'
            else childStateByRole[role.id] = 'some'
          })
        }
        return { ...permission, childStateByRole }
      }),
    }))
  }, [localChecked, allPermissionGroups, roles])

  const loading = rolesLoading || permsLoading

  if (loading || allPermissionGroups.length === 0) {
    return <div style={{ padding: 40 }}>Loading...</div>
  }

  return (
    <Box sx={{ padding: 2 }}>
      <div
        style={{
          maxHeight: 'calc(100vh - 180px)',
          overflow: 'auto',
          position: 'relative',
          background: '#fafafa',
          borderRadius: 12,
          border: '2px solid #f9f9fa',
          padding: '5px',
        }}
      >
        <table
          style={{
            minWidth: 'max-content',
            borderCollapse: 'separate',
            borderSpacing: 0,
            tableLayout: 'fixed',
            marginBottom: 0,
            marginTop: 0,
          }}
        >
          <thead style={{ borderRadius: '16px', overflow: 'hidden' }}>
            <tr>
              <th
                style={{
                  padding: 12,
                  minWidth: 250,
                  position: 'sticky',
                  top: stickyHeaderTop,
                  left: 0,
                  background: '#fff',
                  zIndex: 12,
                  boxShadow: '0 2px 0 #ddd',
                }}
              >
                Разрешения
              </th>
              {roles.map((role) => (
                <th
                  key={role.id}
                  style={{
                    padding: 12,
                    textAlign: 'center',
                    background: '#fff',
                    position: 'sticky',
                    top: stickyHeaderTop,
                    zIndex: 11,
                    boxShadow: '0 2px 0 #ddd',
                  }}
                >
                  <div style={{ fontSize: 10, color: '#999' }}>ROLE</div>
                  <div>{role.name}</div>
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {computedGroups.map((group, index) => (
              <PermissionGroupSection
                key={group.id}
                checkedPermissionsByRole={effectiveChecked}
                group={group}
                isFirstGroup={index === 0}
                isLastGroup={index === computedGroups.length - 1}
                isOpen={!!openGroups[group.id]}
                onToggle={toggleOpenGroup}
                roles={roles}
                onTogglePermission={handleTogglePermission}
                loadingCell={loadingCell}
              />
            ))}
          </tbody>
        </table>
      </div>
    </Box>
  )
}

export default RollReportPage
