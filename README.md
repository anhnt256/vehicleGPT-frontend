# ChatGPT Assistant Application

A modern web-based chat application that allows users to interact with an AI assistant powered by GPT technology.

## 🌟 Features | Tính năng

- Real-time chat interface with AI assistant | Giao diện chat thời gian thực với trợ lý AI
- Beautiful and responsive UI design | Thiết kế UI đẹp và tương thích đa thiết bị
- Secure authentication with Clerk | Xác thực bảo mật với Clerk
- Markdown support for rich text formatting | Hỗ trợ Markdown để định dạng văn bản
- Code syntax highlighting | Tô sáng cú pháp code
- Error handling and loading states | Xử lý lỗi và trạng thái loading

## 🚀 Technologies Used | Công nghệ sử dụng

- React + TypeScript
- Vite
- TailwindCSS
- Clerk Authentication
- React Query
- Axios
- React Markdown
- Sonner (Toast notifications)

## 📦 Installation | Cài đặt

1. Clone the repository | Clone dự án

```bash
git clone <repository-url>
cd <project-directory>
```

2. Install dependencies | Cài đặt dependencies

```bash
npm install
```

3. Create `.env` file and add required environment variables | Tạo file `.env` và thêm các biến môi trường

```env
VITE_CLERK_PUBLISHABLE_KEY=your_clerk_key
VITE_API_URL=your_api_url
```

4. Start development server | Khởi chạy môi trường development

```bash
npm run dev
```

## 🔧 Configuration | Cấu hình

The project uses Vite as the build tool with the following configuration:

- Port: 3000
- Allowed hosts: verhicle.up.railway.app
- Path aliases: '@' points to './src'

## 📁 Project Structure | Cấu trúc dự án

```
src/
├── components/         # Reusable components
│   └── chat/          # Chat-specific components
├── hooks/             # Custom React hooks
├── lib/              # Utility functions
├── pages/            # Page components
│   └── Dashboard/    # Dashboard and chat interface
├── services/         # API services
└── styles/          # Global styles
```

## 🔒 Authentication | Xác thực

The application uses Clerk for authentication. Users need to:

1. Sign up/Sign in using Clerk
2. Authentication token is automatically managed
3. All API requests include the auth token in headers

## 💬 Chat Features | Tính năng chat

- Real-time message sending and receiving
- Support for markdown formatting
- Code block syntax highlighting
- Loading states and error handling
- Message history preservation
- Clean and intuitive UI

## 🌐 API Integration | Tích hợp API

The application connects to a backend API with:

- Base URL: verhicle.up.railway.app
- Endpoints:
  - POST /chat/sendMessages: Send messages to AI
  - GET /initData: Initialize user data

## 🤝 Contributing | Đóng góp

Feel free to:

1. Fork the project
2. Create a feature branch
3. Submit a pull request

## 📄 License | Giấy phép

MIT License

## 🆘 Support | Hỗ trợ

For support, please create an issue in the repository or contact the development team.

---

Made with ❤️ by the development team
