import { useCallback, useMemo, useState } from "react";
import { useDropzone } from "react-dropzone";
import * as xlsx from "xlsx";
import { Paper, Box, Button, Typography } from "@mui/material";
import {
  NaverSheetData,
  ProductSheetData,
  ResultSheetData,
  SkuSheetData,
} from "./SheetData";
import { getSimilarity } from "./utils";
import { downloadExcel } from "./downloadExcel";
type WorkBook = {
  title: string;
  sheets: {
    title: string;
    data: unknown[];
  }[];
};
export const ExcelDropzone = () => {
  const [workBooks, setWorkBooks] = useState<WorkBook[]>([]);
  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    const newSheets = await Promise.all(
      acceptedFiles.map((file) => {
        return new Promise<WorkBook>((res) => {
          const reader = new FileReader();
          reader.onabort = () => console.log("file reading was aborted");
          reader.onerror = () => console.log("file reading has failed");
          reader.onload = () => {
            // Do whatever you want with the file contents
            const binaryStr = reader.result;
            const fileInformation = xlsx.read(binaryStr, {
              type: "buffer",
              cellText: false,
              cellDates: true,
            });
            res({
              title: file.name,
              sheets: fileInformation.SheetNames.map((sheetName) => {
                const rawData = fileInformation.Sheets[sheetName];
                const data = xlsx.utils.sheet_to_json(rawData);
                return {
                  title: sheetName,
                  data,
                };
              }),
            });
          };
          reader.readAsArrayBuffer(file);
        });
      })
    );
    setWorkBooks(newSheets);
  }, []);
  const products = useMemo(() => {
    const sellingTable = workBooks.find((item) =>
      item.title.includes("selling table")
    );
    if (!sellingTable) return [];
    const skuList = sellingTable.sheets.find((item) => item.title === "sku")
      ?.data as SkuSheetData[] | undefined;
    if (!skuList) return [];
    const productList = sellingTable.sheets.find(
      (item) => item.title === "product"
    )?.data as ProductSheetData[] | undefined;
    if (!skuList || !productList) return [];
    return productList.map((item) => ({
      id: item.ID,
      name: item.상품명,
      sellingItems: item.매핑.split(",").map((str) => {
        const [skuId, quantity] = str.split("-");
        const sku = skuList.find((s) => s.ID.toString() === skuId.toString());
        if (!sku) {
          throw Error(
            `${item.상품명}과 매칭되는 최소 단위를 찾을 수 없습니다. ${str}`
          );
        }
        return {
          id: sku.ID,
          name: sku.상품명,
          quantity,
        };
      }),
    }));
  }, [workBooks]);
  const result = useMemo(() => {
    const result: ResultSheetData[] = [];
    if (!products.length) return [];
    const naverWorkBooks = workBooks.filter((item) =>
      item.title.includes("naver")
    );
    for (const naverWorkBook of naverWorkBooks) {
      const naverSheetData = naverWorkBook.sheets[0]!.data as NaverSheetData[];
      for (const row of naverSheetData) {
        let product = products[0];
        let similarity = getSimilarity(row.상품명, product.name);
        products.forEach((item) => {
          const compare = getSimilarity(row.상품명, item.name);
          if (compare > similarity) {
            similarity = compare;
            product = item;
          }
        });
        product.sellingItems.forEach((sellingItem) => {
          result.push({
            날짜: row.결제일,
            "받는사람(수취인)": row.구매자명,
            전화번호: row.수취인연락처1,
            상품명: sellingItem.name,
            수량: sellingItem.quantity,
            우편번호: row.우편번호,
            주소: row.통합배송지,
            배송메시지: row.배송메세지,
            상세주소: row.상세배송지,
          });
        });
      }
    }
    return result;
  }, [products, workBooks]);
  const { getRootProps, getInputProps } = useDropzone({ onDrop });
  return (
    <Paper
      variant="outlined"
      sx={{
        padding: "2rem",
      }}
    >
      <Paper {...getRootProps()} sx={{ p: 2, mb: 2 }} variant="outlined">
        <input {...getInputProps()} />
        <Typography variant="body1">파일 D&D</Typography>
      </Paper>
      {workBooks.map((sheet) => (
        <Box key={sheet.title}>
          <Button onClick={() => console.log(sheet)}>{sheet.title}</Button>
        </Box>
      ))}
      {result.length > 0 && (
        <Box>
          <Button onClick={() => downloadExcel(result, "발주시트 결과")}>
            발주시트 다운로드
          </Button>
        </Box>
      )}
    </Paper>
  );
};
