import { Container, Paper, CssBaseline, Box, Typography } from "@mui/material";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import "./App.css";
import { ExcelDropzone } from "./ExcelDropZone";

function App() {
  const theme = createTheme({});

  return (
    <>
      <CssBaseline />
      <ThemeProvider theme={theme}>
        <Container component="main" maxWidth="md">
          <Paper
            elevation={2}
            sx={{
              padding: "2rem",
              textAlign: "initial",
            }}
            variant="outlined"
          >
            <Typography variant="h5" gutterBottom>
              상품 - SKU 발주 생성기
            </Typography>
            <Box>
              <Typography variant="body1">작동 설명서</Typography>
              <Typography variant="body2" gutterBottom>
                <ul>
                  <li>selling table을 첨부하세요 (필수)</li>
                  <li>파일명에 naver 또는 cafe24를 포함하세요. (필수)</li>
                  <li>numbers, excel만 첨부 가능해요.</li>
                  <li>
                    발주 생성기는 어떠한 정보도 따로 저장하거나 활용하지 않아요.
                    오직 웹페이지 안에서 또 다른 시트를 생성하는 것에만
                    사용돼요.
                  </li>
                  <li>
                    재고를 관리하는 최소 단위를 SKU(Stock Keeping Per Unit)라고
                    불러요. 하지만 보통은 Cafe24, 스마트스토어 등 외부 스토어에
                    올릴 때 판매하는 최소 단위는 SKU가 아니에요. SKU를 묶은
                    단위를 Product(상품)이라고 부를게요. 이 페이지는 외부 스마트
                    스토어에서 제공한 Product 단위의 발주 시트를 SKU 단위의 발주
                    시트로 바꿔줘요.
                  </li>
                </ul>
              </Typography>
            </Box>
            <ExcelDropzone />
          </Paper>
        </Container>
      </ThemeProvider>
    </>
  );
}

export default App;
