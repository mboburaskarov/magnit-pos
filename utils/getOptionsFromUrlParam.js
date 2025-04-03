export default function getOptionsFromUrlParam(urlParam, optionsList, objectKey = 'name', name = 'name') {
  return urlParam?.split(',').map((item) =>
    optionsList
      ? {
          id: item,
          [name]: optionsList.find((option) => option?.id === item)?.[objectKey] ?? 'not found',
        }
      : { id: item, name: item }
  )
}
