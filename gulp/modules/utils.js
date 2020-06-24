function sortProperties(object) {
  let sortable = []
  for (const key in object) {
    if (object.hasOwnProperty(key)) {
      sortable.push([key, object[key]])
    }
  }

  sortable.sort(function (a, b) {
    const x = a[1].toLowerCase(),
      y = b[1].toLowerCase()
    return x < y ? -1 : x > y ? 1 : 0
  })

  return sortable // array in format [ [ key1, val1 ], [ key2, val2 ], ... ]
}

exports.sortProperties = sortProperties
