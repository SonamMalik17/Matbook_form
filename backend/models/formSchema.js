export const formSchema = {
  title: 'Employee Onboarding',
  description: 'Capture key details to onboard a new hire into the MatBook teams.',
  fields: [
    {
      id: 'fullName',
      label: 'Full Name',
      type: 'text',
      placeholder: 'Jane Doe',
      required: true,
      validations: { minLength: 2, maxLength: 60 }
    },
    {
      id: 'email',
      label: 'Work Email',
      type: 'text',
      placeholder: 'jane@matbook.com',
      required: true,
      validations: {
        regex: '^[\\w-.]+@([\\w-]+\\.)+[\\w-]{2,4}$'
      }
    },
    {
      id: 'age',
      label: 'Age',
      type: 'number',
      placeholder: 'e.g. 29',
      required: true,
      validations: { min: 18, max: 70 }
    },
    {
      id: 'department',
      label: 'Department',
      type: 'select',
      placeholder: 'Choose department',
      required: true,
      options: [
        { label: 'Engineering', value: 'engineering' },
        { label: 'Product', value: 'product' },
        { label: 'Design', value: 'design' },
        { label: 'Marketing', value: 'marketing' },
        { label: 'Sales', value: 'sales' },
        { label: 'People Ops', value: 'people-ops' }
      ]
    },
    {
      id: 'skills',
      label: 'Primary Skills',
      type: 'multi-select',
      placeholder: 'Select at least one',
      required: true,
      options: [
        { label: 'React', value: 'react' },
        { label: 'TypeScript', value: 'typescript' },
        { label: 'Node.js', value: 'node' },
        { label: 'SQL', value: 'sql' },
        { label: 'UX Research', value: 'ux' },
        { label: 'Go', value: 'go' },
        { label: 'Python', value: 'python' }
      ],
      validations: { minSelected: 1, maxSelected: 5 }
    },
    {
      id: 'startDate',
      label: 'Start Date',
      type: 'date',
      placeholder: 'YYYY-MM-DD',
      required: true,
      validations: {
        minDate: new Date().toISOString().split('T')[0]
      }
    },
    {
      id: 'bio',
      label: 'About You',
      type: 'textarea',
      placeholder: 'Brief background and goals',
      validations: { maxLength: 300 }
    },
    {
      id: 'remoteEligible',
      label: 'Remote Eligible',
      type: 'switch',
      placeholder: '',
      required: false
    }
  ]
};
