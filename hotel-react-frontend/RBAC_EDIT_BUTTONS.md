# Role-Based Access Control for Edit Buttons

## Overview
This document describes the implementation of role-based access control (RBAC) for Edit buttons across all tables in the hotel management system.

## Implementation Date
November 10, 2025

## Access Control Rules

### Housekeeping Module Tables
**Files Modified:**
- `src/pages/operational/housekeeping/master_data/MasterRoomType.jsx`
- `src/pages/operational/housekeeping/master_data/ManagementRoom.jsx`

**Access Rights:**
- ✅ **Admin**: Can see and use Edit button
- ✅ **Manager**: Can see and use Edit button
- ✅ **Housekeeping**: Can see and use Edit button
- ❌ **Front Office**: Cannot see Edit button (read-only access)
- ❌ **Staff**: Cannot see Edit button (read-only access)

### Implementation Details

#### 1. Import useAuth Hook
```jsx
import { useAuth } from '../../../../context/AuthContext';
```

#### 2. Get Current User
```jsx
const { user } = useAuth();
```

#### 3. Create Permission Check Function
```jsx
// Check if user has edit permission
const canEdit = () => {
  return ['admin', 'manager', 'housekeeping'].includes(user?.role);
};
```

#### 4. Conditional Rendering of Edit Button
```jsx
<td>
  {canEdit() && (
    <button className="btn-table-action">Edit</button>
  )}
</td>
```

## Benefits

1. **Security**: Prevents unauthorized users from accessing edit functionality
2. **Role Separation**: Clear separation between read-only and edit roles
3. **User Experience**: Users only see options they can actually use
4. **Maintainability**: Centralized permission logic using canEdit() function

## Testing Checklist

Test with different user roles:

- [ ] **Admin Login**: Verify Edit buttons appear in all tables
- [ ] **Manager Login**: Verify Edit buttons appear in all tables
- [ ] **Housekeeping Login**: Verify Edit buttons appear in housekeeping tables
- [ ] **Front Office Login**: Verify NO Edit buttons appear in housekeeping tables
- [ ] **Staff Login**: Verify NO Edit buttons appear (if staff role exists)

## Future Enhancements

Consider applying similar RBAC to:
1. ✅ Housekeeping Master Data (MasterRoomType, ManagementRoom) - COMPLETED
2. Delete buttons (if they exist)
3. Add/Create buttons for new records
4. Export/Print functionality
5. Other sensitive operations

## User Roles Reference

Current system roles:
- `admin` - Full system access
- `manager` - Management level access
- `staff` - Basic staff access
- `frontoffice` - Front office specific access
- `housekeeping` - Housekeeping specific access

## Notes

- Edit buttons are completely hidden (not just disabled) for unauthorized users
- This improves UI clarity and prevents confusion
- The backend should also implement the same permission checks for API endpoints
- Permission checks use optional chaining (`user?.role`) to handle cases where user might be null
