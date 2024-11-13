export default function getOptionsFromUrlParam(urlParam, optionsList, objectKey = 'name') {
  return urlParam?.split(',').map((item) =>
    optionsList
      ? {
          id: item,
          [objectKey]: optionsList.find((option) => option?._id === item)?.[objectKey] ?? 'not found',
        }
      : { id: item, name: item }
  )
}
