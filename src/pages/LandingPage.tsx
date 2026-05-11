import { Link } from 'react-router-dom';

const cards = [
  { to: '/store', title: '매장 상세', desc: '에슬로우커피 라운지점' },
  { to: '/menu', title: '메뉴판', desc: '통합 프로토타입 · 카트 / 상세 / 모달' },
  { to: '/magazine', title: '매거진 콘텐츠 상세', desc: '성수동 노트북 작업 카페 12곳' },
  { to: '/magazine/list', title: '매거진 게시물 목록', desc: '히어로 카드 + 카테고리 칩 리스트' },
  { to: '/blog', title: '블로그 관리 (백오피스)', desc: 'Paytalab Admin · 게시물 상태 관리 / 등록 / 미리보기' },
];

export default function LandingPage() {
  return (
    <div
      style={{
        background: '#0f1115',
        color: '#e7e9ee',
        fontFamily:
          "-apple-system, BlinkMacSystemFont, system-ui, 'Apple SD Gothic Neo', 'Malgun Gothic', sans-serif",
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'flex-start',
        justifyContent: 'center',
        padding: '48px 20px',
      }}
    >
      <div style={{ width: '100%', maxWidth: 720 }}>
        <h1 style={{ fontSize: 22, margin: '0 0 6px', letterSpacing: '-0.01em' }}>
          Passorder Wireframe Preview
        </h1>
        <p style={{ color: '#9aa3b2', margin: '0 0 28px', fontSize: 14 }}>
          미리보기할 페이지를 선택하세요.
        </p>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 12 }}>
          {cards.map((c) => (
            <Link
              key={c.to}
              to={c.to}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '18px 20px',
                background: '#1a1d24',
                border: '1px solid #2a2f3a',
                borderRadius: 14,
                color: '#e7e9ee',
                textDecoration: 'none',
              }}
            >
              <div>
                <div style={{ fontWeight: 600, fontSize: 16 }}>{c.title}</div>
                <div style={{ color: '#9aa3b2', fontSize: 13, marginTop: 4 }}>{c.desc}</div>
              </div>
              <span style={{ color: '#ffd84d', fontSize: 18 }}>→</span>
            </Link>
          ))}
        </div>
        <footer style={{ marginTop: 32, color: '#9aa3b2', fontSize: 12 }}>
          © Passorder · wireframe preview
        </footer>
      </div>
    </div>
  );
}
