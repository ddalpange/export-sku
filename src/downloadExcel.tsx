import * as xlsx from "xlsx";

export const downloadExcel = (data: object[], fileName: string) => {
  const excelFileName = `${fileName}.xlsx`;
  const ws: xlsx.WorkSheet = xlsx.utils.json_to_sheet(data);
  const wb: xlsx.WorkBook = xlsx.utils.book_new();
  xlsx.utils.book_append_sheet(wb, ws, "Sheet1");
  xlsx.writeFile(wb, excelFileName);
};
