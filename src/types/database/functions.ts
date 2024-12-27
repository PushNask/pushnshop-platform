export type SecurityFunctions = {
  check_login_attempts: {
    Args: {
      p_email: string
      p_window_minutes?: number
      p_max_attempts?: number
    }
    Returns: boolean
  }
  generate_csrf_token: {
    Args: {
      p_user_id: string
    }
    Returns: { token: string }
  }
  validate_csrf_token: {
    Args: {
      p_token: string
      p_user_id: string
    }
    Returns: boolean
  }
}