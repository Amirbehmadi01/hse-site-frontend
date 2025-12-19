
// // import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
// // import Home from "./pages/Home";
// // import Checklist from "./pages/Checklist";
// // import PreviousChecklists from "./pages/PreviousChecklists";
// // import BackButton from "./components/BackButton";
// // import "./App.css";

// // function App() {
// //   return (
// //     <Router>
// //       <div style={{ direction: "rtl", fontFamily: "sans-serif" }}>
// //         {/* دکمه‌ی برگشت (در تمام صفحات به جز Home) */}
// //         <BackButton />

// //         {/* مسیرها */}
// //         <Routes>
// //           <Route path="/" element={<Home />} />
// //           <Route path="/checklist/:type" element={<Checklist />} />
// //           <Route
// //             path="/checklist/:type/previous"
// //             element={<PreviousChecklists />}
// //           />
// //         </Routes>
// //       </div>
// //     </Router>
// //   );
// // }

// // export default App;
// import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
// import Home from "./pages/Home";
// import Checklist from "./pages/Checklist";
// import PreviousChecklists from "./pages/PreviousChecklists";
// import BackButton from "./components/BackButton";
// import "./App.css";

// function Layout({ children }) {
//   const location = useLocation();

//   return (
//     <div style={{ direction: "rtl", fontFamily: "sans-serif" }}>
//       {/* دکمه‌ی برگشت -- فقط وقتی روی صفحه‌ی Home نیستیم */}
//       {location.pathname !== "/" && <BackButton />}

//       {children}
//     </div>
//   );
// }

// function App() {
//   return (
//     <Router>
//       <Layout>
//         <Routes>
//           <Route path="/" element={<Home />} />
//           <Route path="/checklist/:type" element={<Checklist />} />
//           <Route path="/checklist/:type/previous" element={<PreviousChecklists />} />
//         </Routes>
//       </Layout>
//     </Router>
//   );
// }

// export default App;

import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import Home from "./pages/Home";
import Checklist from "./pages/Checklist";
import PreviousChecklists from "./pages/PreviousChecklists";
import BackButton from "./components/BackButton";
import "./App.css";

function Layout({ children }) {
  const location = useLocation();

  return (
    <div className="app-layout">
      {/* دکمه‌ی برگشت -- فقط وقتی روی صفحه‌ی Home نیستیم */}
      {location.pathname !== "/" && <BackButton />}

      {children}
    </div>
  );
}

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/checklist/:type" element={<Checklist />} />
          <Route path="/checklist/:type/previous" element={<PreviousChecklists />} />
          {/* مسیرهای جدید می‌توانند اینجا اضافه شوند */}
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;