import { requests } from '@utils/requests'
// import { CheckSquare, ChevronDown, ChevronRight, MinusSquare, Square } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import { useQuery } from 'react-query'

export default function PermissionsManager() {
  const [searchTerm, setSearchTerm] = useState('')
  const [permissions, setPermissions] = useState({})
  const [rolesPermissionsMap, setRolesPermissionsMap] = useState({})
  const [openGroups, setOpenGroups] = useState({}) // 👈 collapse state

  // =============================
  // GET LIST OF ROLES
  // =============================
  const { data: rolesList, isLoading } = useQuery(['rolesList'], () => requests.getAllRoles({ limit: 100 }))

  const roles = rolesList?.data?.data?.data || []

  // Initialize checkbox states from backend is_active
  useEffect(() => {
    if (Object.keys(rolesPermissionsMap).length === 0) return

    const initial = {}

    Object.entries(rolesPermissionsMap).forEach(([roleId, groups]) => {
      groups.forEach((group) => {
        group.permissions.forEach((perm) => {
          if (perm.is_active) {
            initial[`${roleId}-${perm.id}`] = true
          }

          perm.children?.forEach((child) => {
            if (child.is_active) {
              initial[`${roleId}-${child.id}`] = true
            }
          })
        })
      })
    })

    setPermissions(initial)
  }, [rolesPermissionsMap])

  // ======================================================
  // LOAD PERMISSIONS FOR EACH ROLE
  // ======================================================
  useEffect(() => {
    if (roles.length === 0) return

    async function loadPermissions() {
      const result = {}

      for (const role of roles) {
        const res = await requests.getAllRolesWithPermissions({
          role_id: role.id,
          limit: 100,
          offset: 0,
        })

        result[role.id] = res.data?.data || []
      }

      setRolesPermissionsMap(result)
    }

    loadPermissions()
  }, [roles])

  if (isLoading || Object.keys(rolesPermissionsMap).length === 0) {
    return <div style={{ padding: 40 }}>Loading...</div>
  }

  // ======================================================
  // UNIQUE GROUPS
  // ======================================================
  const allPermissionGroups = []

  Object.values(rolesPermissionsMap).forEach((rolePermissions) => {
    rolePermissions.forEach((group) => {
      if (!allPermissionGroups.find((g) => g.id === group.id)) {
        allPermissionGroups.push(group)
      }
    })
  })

  // ======================================================
  // CHECKBOX HANDLERS
  // ======================================================
  const isChecked = (roleId, permissionId) => {
    return !!permissions[`${roleId}-${permissionId}`]
  }

  const togglePermission = (roleId, permissionId) => {
    setPermissions((prev) => ({
      ...prev,
      [`${roleId}-${permissionId}`]: !prev[`${roleId}-${permissionId}`],
    }))
  }

  const getGroupState = (roleId, children) => {
    const checkedCount = children.filter((child) => isChecked(roleId, child.id)).length
    if (checkedCount === 0) return 'none'
    if (checkedCount === children.length) return 'all'
    return 'some'
  }

  const toggleGroup = (roleId, permission) => {
    const state = getGroupState(roleId, permission.children)
    const newState = state !== 'all'

    const updates = {}

    updates[`${roleId}-${permission.id}`] = newState

    permission.children.forEach((child) => {
      updates[`${roleId}-${child.id}`] = newState
    })

    setPermissions((prev) => ({ ...prev, ...updates }))
  }

  const renderCheckbox = (roleId, permission, isParent = false) => {
    if (isParent && permission.children?.length > 0) {
      const groupState = getGroupState(roleId, permission.children)
      return (
        <button onClick={() => toggleGroup(roleId, permission)} style={{ background: 'none', border: 'none' }}>
          {groupState === 'all' && <CheckSquare size={18} color='#1976d2' />}
          {groupState === 'some' && <MinusSquare size={18} color='#1976d2' />}
          {groupState === 'none' && <Square size={18} color='#ccc' />}
        </button>
      )
    }

    return (
      <button onClick={() => togglePermission(roleId, permission.id)} style={{ background: 'none', border: 'none' }}>
        {isChecked(roleId, permission.id) ? <CheckSquare size={18} color='#1976d2' /> : <Square size={18} color='#ccc' />}
      </button>
    )
  }

  // ======================================================
  // RENDER
  // ======================================================
  return (
    <div
      style={{
        padding: 24,
        height: '100vh',
        overflow: 'auto',
        overflowX: 'auto', // ← ADD
        overflowY: 'auto', // ← ADD

        background: '#fafafa',
      }}
    >
      <table
        style={{
          minWidth: 'max-content',
          borderCollapse: 'collapse',
          tableLayout: 'fixed',
        }}
      >
        {/* ========================= */}
        {/* STICKY HEADER */}
        {/* ========================= */}
        <thead>
          <tr>
            <th
              style={{
                padding: 12,
                minWidth: 250,
                position: 'sticky',
                left: 0,
                background: '#fff',
                zIndex: 5,
                borderBottom: '2px solid #ddd',
              }}
            ></th>

            {roles.map((role) => (
              <th
                key={role.id}
                style={{
                  padding: 12,
                  textAlign: 'center',
                  background: '#fff',
                  position: 'sticky',
                  top: 0,
                  borderBottom: '2px solid #ddd',
                  zIndex: 4,
                }}
              >
                <div style={{ fontSize: 10, color: '#999' }}>ROLE</div>
                <div>{role.name}</div>
              </th>
            ))}
          </tr>
        </thead>

        {/* ========================= */}
        {/* BODY */}
        {/* ========================= */}
        <tbody>
          {allPermissionGroups.map((group) =>
            group.permissions?.map((permission) => {
              const open = openGroups[permission.id] ?? true

              return (
                <React.Fragment key={permission.id}>
                  {/* Parent Row */}
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
                        zIndex: 3,
                        borderBottom: '1px solid #eee',
                      }}
                    >
                      <button
                        onClick={() =>
                          setOpenGroups((p) => ({
                            ...p,
                            [permission.id]: !open,
                          }))
                        }
                        style={{
                          background: 'none',
                          border: 'none',
                          cursor: 'pointer',
                        }}
                      >
                        {open ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                      </button>

                      {permission.name}
                    </td>

                    {roles.map((role) => (
                      <td
                        key={role.id}
                        style={{
                          textAlign: 'center',
                          borderBottom: '1px solid #eee',
                        }}
                      >
                        {renderCheckbox(role.id, permission, true)}
                      </td>
                    ))}
                  </tr>

                  {/* Children */}
                  {open &&
                    permission.children?.map((child) => (
                      <tr key={child.id}>
                        <td
                          style={{
                            padding: '8px 16px 8px 56px',
                            position: 'sticky',
                            left: 0,
                            background: '#fff',
                            zIndex: 2,
                            borderBottom: '1px solid #f2f2f2',
                          }}
                        >
                          {child.name}
                        </td>

                        {roles.map((role) => (
                          <td
                            key={role.id}
                            style={{
                              textAlign: 'center',
                              borderBottom: '1px solid #f2f2f2',
                            }}
                          >
                            {renderCheckbox(role.id, child)}
                          </td>
                        ))}
                      </tr>
                    ))}
                </React.Fragment>
              )
            })
          )}
        </tbody>
      </table>
    </div>
  )
}
