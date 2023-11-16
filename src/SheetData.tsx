export type SkuSheetData = {
  ID: number;
  상품명: string;
};
export type ProductSheetData = {
  ID: number;
  상품명: string;
  // 1-3,2-1,3-2 ID-Quantity 매핑
  매핑: string;
};
export type NaverSheetData = {
  결제일: Date;
  구매자ID: string; // masked
  구매자명: string;
  기본배송지: string;
  발송기한: Date;
  발송일: Date;
  배송방법: string; // ex 택배,등기,소포
  "배송방법(구매자요청)": string;
  상세배송지: string;
  상품가격: number;
  상품명: string;
  상품번호: string;
  송장번호: string; // number string
  수량: number;
  수취인명: string;
  수취인연락처1: string;
  옵션가격: number;
  옵션정보: string;
  우편번호: string;
  주문번호: string;
  주문상태: string;
  주문세부상태: string;
  주문일시: Date;
  택배사: string;
  통합배송지: string;
  배송메세지: string;
  "판매자 상품코드": string;
  판매채널: string;
};

export type ResultSheetData = {
  "받는사람(수취인)": string;
  날짜: Date;
  전화번호: string;
  주소: string;
  상세주소: string;
  상품명: string;
  수량: string;
  배송메시지: string;
  우편번호: string;
};
