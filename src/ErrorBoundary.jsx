import ErrorPage from './pages/error'
import ErrorPageLocal from './pages/errorlocal'
import { Component } from 'react'

class ErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = {
      hasError: false,
      errorData: {},
    }
  }

  componentDidCatch(error, errorInfo) {
    this.setState(() => ({ hasError: true }))
    this.setState(() => ({
      errorData: {
        error,
        errorInfo: errorInfo?.componentStack,
      },
    }))
  }

  render() {
    const { hasError } = this.state
    const { errorData } = this.state
    const { children } = this.props
    if (hasError) {
      if (import.meta.env.VITE_APP_ENVIRONMENT !== 'prod') {
        return <ErrorPageLocal errorData={errorData} />
      } else {
        return <ErrorPage errorData={errorData} />
      }
    }

    return children
  }
}
export default ErrorBoundary
