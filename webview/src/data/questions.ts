export interface Question {
  id: number;
  text: string;
  options: {
    label: string;
    value: string; // Tag to match in product
  }[];
}

export const questions: Question[] = [
  {
    id: 1,
    text: "Bạn thường dùng nước hoa vào dịp nào?",
    options: [
      { label: "Đi làm / Văn phòng", value: "Office" },
      { label: "Hẹn hò lãng mạn", value: "Romantic" },
      { label: "Tiệc tùng / Sự kiện", value: "Party" },
      { label: "Đi chơi / Dạo phố", value: "Daily" },
    ]
  },
  {
    id: 2,
    text: "Phong cách mùi hương yêu thích của bạn?",
    options: [
      { label: "Tươi mát, Sảng khoái", value: "Fresh" },
      { label: "Ngọt ngào, Quyến rũ", value: "Sweet" },
      { label: "Ấm áp, Gỗ, Sang trọng", value: "Woody" },
      { label: "Nhẹ nhàng, Hoa cỏ", value: "Floral" },
    ]
  },
  {
    id: 3,
    text: "Mức ngân sách dự kiến của bạn?",
    options: [
      { label: "Dưới 1.5 triệu", value: "Budget" },
      { label: "1.5 - 3 triệu", value: "Mid" },
      { label: "Trên 3 triệu", value: "Luxury" },
    ]
  }
];
