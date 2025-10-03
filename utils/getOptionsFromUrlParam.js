export default function getOptionsFromUrlParam(urlParam, optionsList, objectKey = 'name', name = 'name') {
  console.log(urlParam?.split(','), optionsList, urlParam, optionsList.find((option) => option?.id === 'arzon-apteka')?.[objectKey])

  return urlParam?.split(',').map((item) =>
    optionsList
      ? {
          id: item,
          [name]: optionsList.find((option) => option?.id === item)?.[objectKey] ?? 'not found',
        }
      : { id: item, name: item }
  )
}
