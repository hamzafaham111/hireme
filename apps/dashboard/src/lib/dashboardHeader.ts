/**
 * Derives header title/subtitle from the URL for the operations shell.
 */
export function dashboardHeader(pathname: string): {
  title: string
  subtitle?: string
} {
  if (pathname === '/' || pathname === '') {
    return {
      title: 'Overview',
      subtitle: 'Hire Me — connect customers with workers',
    }
  }

  if (pathname === '/users/new') {
    return {
      title: 'Add user',
      subtitle: 'Create an internal dashboard account',
    }
  }

  if (/\/users\/[^/]+\/edit$/.test(pathname)) {
    return {
      title: 'Edit user',
      subtitle: 'Update name, role, and access',
    }
  }

  if (/\/users\/[^/]+$/.test(pathname) && pathname !== '/users/new') {
    return {
      title: 'User',
      subtitle: 'Account details',
    }
  }

  if (pathname.startsWith('/users')) {
    return {
      title: 'Users',
      subtitle: 'Internal team accounts (dashboard access)',
    }
  }

  if (pathname.startsWith('/roles')) {
    return {
      title: 'Roles',
      subtitle: 'Who can do what in this dashboard',
    }
  }

  if (pathname === '/workers/new') {
    return {
      title: 'Add worker',
      subtitle: 'Register a service provider',
    }
  }

  if (/\/workers\/[^/]+\/edit$/.test(pathname)) {
    return {
      title: 'Edit worker',
      subtitle: 'Update worker profile',
    }
  }

  if (/\/workers\/[^/]+$/.test(pathname) && pathname !== '/workers/new') {
    return {
      title: 'Worker',
      subtitle: 'Profile and ratings',
    }
  }

  if (pathname.startsWith('/workers')) {
    return {
      title: 'Workers',
      subtitle: 'Service providers — contact, ratings, availability',
    }
  }

  if (pathname === '/jobs/new') {
    return {
      title: 'Create job',
      subtitle: 'Log a customer request',
    }
  }

  if (/\/jobs\/[^/]+\/edit$/.test(pathname)) {
    return {
      title: 'Edit job',
      subtitle: 'Update job details',
    }
  }

  if (/\/jobs\/[^/]+$/.test(pathname) && pathname !== '/jobs/new') {
    return {
      title: 'Job',
      subtitle: 'Request and assignment',
    }
  }

  if (pathname.startsWith('/jobs')) {
    return {
      title: 'Jobs',
      subtitle: 'Customer requests from WhatsApp & website',
    }
  }

  if (pathname === '/blog/new') {
    return {
      title: 'New blog post',
      subtitle: 'Markdown content for the public marketing site',
    }
  }

  if (/\/blog\/[^/]+\/edit$/.test(pathname)) {
    return {
      title: 'Edit blog post',
      subtitle: 'Update title, slug, excerpt, or body',
    }
  }

  if (pathname.startsWith('/blog')) {
    return {
      title: 'Blog',
      subtitle: 'Marketing posts — SEO and reach',
    }
  }

  return {
    title: 'Overview',
    subtitle: 'Hire Me — connect customers with workers',
  }
}
