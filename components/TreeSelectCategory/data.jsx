export const data = [
  {
    id: 'applications',
    label: 'Applications',
    // type: 'main',
    children: [
      {
        id: 'applications.calendar',
        label: 'Calender',
        // type: 'sub',
      },
      {
        id: 'applications.chrome',
        label: 'Chrome',
        // type: 'sub',
      },
      {
        id: 'applications.webstorm',
        label: 'Webstorm',
        // type: 'sub',
      },
    ],
  },
  {
    id: 'test',
    label: 'Test',
    // type: 'main',
  },
  {
    id: 'documents',
    label: 'Documents',
    // type: 'main',
    children: [
      {
        id: 'documents.bootstrap',
        label: 'Bootstrap',
        // type: 'sub',
        children: [
          {
            id: 'documents.bootstrap.button',
            label: 'Button',
            // type: 'cat',
          },
          {
            id: 'documents.bootstrap.typography',
            label: 'Typography',
            // type: 'cat',
          },
        ],
      },
      {
        id: 'documents.oss',
        label: 'OSS',
        // type: 'sub',
      },
      {
        id: 'documents.material-ui',
        label: 'Material UI',
        // type: 'sub',
        children: [
          {
            id: 'documents.material-ui.button',
            label: 'Button',
            // type: 'cat',
          },
          {
            id: 'documents.material-ui.typography',
            label: 'Typography',
            // type: 'cat',
          },
          {
            id: 'documents.material-ui.textfield',
            label: 'Text Field',
            // type: 'cat',
          },
        ],
      },
    ],
  },
]
