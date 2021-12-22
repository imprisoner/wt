import XLSX from 'xlsx'

// export function parseExcel(file, sheetName = '') {
//   const reader = new FileReader()
//   const parsedSheet = new Promise((resolve, reject) => {
//     reader.addEventListener('load', function (e) {

//       if (e.target !== null) {

//         const data = e.target.result
//         const workbook = XLSX.read(data, {
//           type: 'binary'
//         })

//         let sheetName
//         let isSheetExists = false

//         while (!isSheetExists) {
//           sheetName = prompt('Введите название листа, с которого читать')
//           if (!sheetName) break

//           isSheetExists = workbook.SheetNames.includes(sheetName)

//           if (isSheetExists) {
//             const jsonObject = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName])
//             resolve(jsonObject);
//           }
//         }

//         return

//       }

//     })

//   })

//   reader.readAsBinaryString(file)

//   // TODO validation of spreadsheet
//   return parsedSheet
// }
export function parseExcel(file, sheetName = '') {
  const reader = new FileReader()
  const parsedSheet = new Promise((resolve, reject) => {
    reader.addEventListener('load', function (e) {

      if (e.target !== null) {

        const data = e.target.result
        const workbook = XLSX.read(data, {
          type: 'binary'
        })

        const exists = workbook.SheetNames.includes(sheetName)


        if (!exists) {
          reject(false)
        }

        const jsonObject = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName])
        resolve(jsonObject);


      }

    })

  })

  reader.readAsBinaryString(file)
  return parsedSheet
}


export function validateExcel(parsedSheet, content = '') {
  // проверка на соответствие столбцов

  let header = Object.keys(parsedSheet[0]).map(key => key.toLowerCase())


  let keywordSet

  if (content === 'resources') {
    keywordSet = ["name", "account", "owner"]
  } else if (content === 'credentials') {
    keywordSet = ["name", "token"]
  } else {
    console.error('Wrong excel parcing mode!')
    return
  }

  let wrongHeader = false

  keywordSet.forEach((heading) => {
    if (!header.includes(heading)) {
      wrongHeader = true
    }
  })

  if (wrongHeader) return false

  return true
}

export function parseHTML(table, exportsData) {
  const workbook = XLSX.utils.table_to_book(table)
  XLSX.writeFile(workbook, `${exportsData.name}.${exportsData.ext}`, {
    bookType: exportsData.ext
  })
}