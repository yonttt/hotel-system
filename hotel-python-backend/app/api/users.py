from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from app.core.database import get_db
from app.core.auth import get_current_user, get_current_admin_user
from app.models import User, UserPermission
from app.schemas import UserResponse, UserPermissionResponse, UserPermissionUpdate

router = APIRouter()

@router.get("/", response_model=List[UserResponse])
def get_all_users(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_admin_user)
):
    """Get all users (admin only)."""
    users = db.query(User).order_by(User.id).all()
    return users

@router.delete("/{user_id}")
def delete_user(
    user_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_admin_user)
):
    """Delete a user (admin only)."""
    if user_id == current_user.id:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Cannot delete your own account"
        )
    
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )
    
    db.delete(user)
    db.commit()
    return {"message": "User deleted successfully"}

@router.get("/permissions", response_model=List[UserPermissionResponse])
def get_all_permissions(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Get all user permissions."""
    permissions = db.query(UserPermission).order_by(UserPermission.role).all()
    return permissions

@router.put("/permissions/{role}", response_model=UserPermissionResponse)
def update_permission(
    role: str,
    permission_update: UserPermissionUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_admin_user)
):
    """Update permissions for a specific role (admin only)."""
    permission = db.query(UserPermission).filter(UserPermission.role == role).first()
    if not permission:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Permission for role {role} not found"
        )
    
    if permission_update.can_view is not None:
        permission.can_view = permission_update.can_view
    if permission_update.can_create is not None:
        permission.can_create = permission_update.can_create
    if permission_update.can_edit is not None:
        permission.can_edit = permission_update.can_edit
    if permission_update.can_delete is not None:
        permission.can_delete = permission_update.can_delete
    
    db.commit()
    db.refresh(permission)
    return permission
