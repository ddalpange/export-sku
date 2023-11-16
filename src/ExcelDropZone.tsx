import { Box, Button, Paper, Typography } from "@mui/material";
import { useCallback, useMemo, useState } from "react";
import { useDropzone } from "react-dropzone";
import * as xlsx from "xlsx";
import {
  NaverSheetData,
  ProductSheetData,
  ResultSheetData,
  SkuSheetData,
} from "./SheetData";
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
        const [skuId, quantity] = str.split("_");
        const sku = skuList.find((s) => s.ID.toString() === skuId.toString());
        if (!sku) {
          throw Error(
            `셀링 테이블 -> ${item.상품명}에서 매칭되는 SKU를 찾을 수 없습니다. ${str}`
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
        const product = products.find((item) => {
          return row.옵션정보
            .replace(/\s/g, "")
            .includes(item.name.replace(/\s/g, ""));
        });
        if (!product) {
          throw Error(
            `네이버 시트 -> ${row.옵션정보}를 찾을 수 없어요. 셀링 테이블에 상품을 추가해 주세요. (이름 포함 필수)`
          );
        }
        product.sellingItems.forEach((sellingItem) => {
          result.push({
            날짜: row.결제일,
            "받는사람(수취인)": row.구매자명,
            전화번호: row.수취인연락처1,
            상품명: sellingItem.name,
            수량: parseInt(sellingItem.quantity) * row.수량,
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
