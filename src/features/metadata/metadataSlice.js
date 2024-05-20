import { createSlice } from '@reduxjs/toolkit'
import Example from '../../metadata/Example.json';

export const metadataSlice = createSlice({
  name: 'metadata',
  initialState: {
    value: Example,
    old: Example
  },
  reducers: {
    setMetadata: (state, data) => {
      state.old = JSON.parse(JSON.stringify(state.value))
      state.value = data.payload
    },
    undoMetadata: (state) => {
      const current = JSON.parse(JSON.stringify(state.value))
      state.value = JSON.parse(JSON.stringify(state.old))
      state.old = JSON.parse(JSON.stringify(current))
    },
    addRole: (state, data) => {
      let addedMetadata = JSON.parse(JSON.stringify(state.value))
      addedMetadata.roles.push({name: data.payload})
      state.old = JSON.parse(JSON.stringify(state.value))
      state.value = JSON.parse(JSON.stringify(addedMetadata))
    },
    removeRole: (state, data) => {
      let removedMetadata = []
      state.value.roles.forEach(role => {
        if (role.name === data.payload) return
        let newRole = {
          name: role.name,
          capabilities: role.capabilities,
          approvedBy: role.approvedBy ? role.approvedBy.filter(approver => approver !== data.payload) : undefined
        }
        if (newRole.capabilities && newRole.capabilities.length < 1) delete newRole.capabilities
        if (newRole.approvedBy && newRole.approvedBy.length < 1) delete newRole.approvedBy
        removedMetadata.push(newRole)
      })
      state.old = JSON.parse(JSON.stringify(state.value))
      state.value = JSON.parse(JSON.stringify({roles: removedMetadata}))
    },
    renameRole: (state, data) => {
      let roles = JSON.parse(JSON.stringify(state.value)).roles
      if (roles.filter(role => role.name === data.payload.new).length > 0) return
      let targetRole = roles.filter(role => role.name === data.payload.old)[0]
      targetRole.name = data.payload.new
      roles.forEach(role => {
        if (role.approvedBy && role.approvedBy.length > 0 && role.approvedBy.includes(data.payload.old)){
          role.approvedBy[role.approvedBy.indexOf(data.payload.old)] = data.payload.new
        }
      })
      state.old = JSON.parse(JSON.stringify(state.value))
      state.value = JSON.parse(JSON.stringify({roles: roles}))
    },
    addApprover: (state, data) => {
      let roles = JSON.parse(JSON.stringify(state.value)).roles
      let targetRole = roles.filter(role => role.name === data.payload.target)[0]
      if (targetRole.approvedBy && targetRole.approvedBy.length > 0){
        targetRole.approvedBy.push(data.payload.source)
      } else {
        targetRole.approvedBy = [data.payload.source]
      }
      state.old = JSON.parse(JSON.stringify(state.value))
      state.value = JSON.parse(JSON.stringify({roles: roles}))
    },
    removeApprovers: (state, data) => {
      let roles = JSON.parse(JSON.stringify(state.value)).roles
      let targetRole = roles.filter(role => role.name === data.payload)[0]
      if (targetRole.approvedBy && targetRole.approvedBy.length > 0){
        delete targetRole.approvedBy
        state.old = JSON.parse(JSON.stringify(state.value))
        state.value = JSON.parse(JSON.stringify({roles: roles}))
      }
    }
  },
})

// Action creators are generated for each case reducer function
export const { setMetadata, undoMetadata, addRole, removeRole, addApprover, removeApprovers, renameRole } = metadataSlice.actions

export default metadataSlice.reducer