import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { BookOpen, Users, Phone, Mail, ArrowRight, CheckCircle, Calendar, Sparkles, Target, Heart, Stethoscope, GraduationCap } from "lucide-react"
import Navigation from "@/components/navigation"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white">
      <Navigation />

      {/* Hero */}
      <section className="py-24 md:py-32 bg-gradient-to-br from-slate-900 via-teal-950 to-slate-900 relative overflow-hidden">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -left-20 -top-20 h-72 w-72 rounded-full bg-teal-500/10 blur-3xl" />
          <div className="absolute -bottom-20 -right-20 h-96 w-96 rounded-full bg-cyan-500/10 blur-3xl" />
        </div>
        <div className="relative container mx-auto px-6 text-center max-w-7xl">
          <div className="max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 bg-teal-500/20 border border-teal-400/30 rounded-full px-5 py-2 mb-6 backdrop-blur-sm">
              <Stethoscope className="h-4 w-4 text-teal-300" />
              <span className="text-sm font-semibold text-teal-200">의치한약수 전문 입시 플랫폼</span>
            </div>
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight tracking-tight">
              의대 합격을 위한
              <br />
              <span className="bg-gradient-to-r from-teal-300 to-cyan-300 bg-clip-text text-transparent">전문 입시 컨설팅</span>
            </h1>
            <p className="text-xl md:text-2xl text-teal-100/80 mb-10 leading-relaxed">
              의대 · 치대 · 한의대 · 약대 · 수의대
              <br />
              수시 교과/종합부터 정시 수능까지 체계적 합격 전략
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-teal-600 hover:bg-teal-700 text-white px-8 py-6 text-lg font-semibold rounded-lg shadow-lg shadow-teal-500/25">
                무료 상담 시작하기
              </Button>
              <Button size="lg" variant="outline" className="px-8 py-6 text-lg font-semibold border-2 border-white/20 text-white hover:bg-white/10 rounded-lg bg-transparent">
                서비스 둘러보기
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* AI 플랫폼 */}
      <section className="py-24 bg-gradient-to-b from-white to-gray-50">
        <div className="container mx-auto px-6 max-w-7xl">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 bg-teal-50 rounded-full px-4 py-2 mb-4">
              <Sparkles className="h-4 w-4 text-teal-600" />
              <span className="text-sm font-semibold text-teal-700">T Skool AI 플랫폼</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              컨설팅을 넘어, <span className="text-teal-700">AI 플랫폼</span>으로 관리합니다
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              의치한약수 입시의 핵심인 내신, 생기부 세특, 수능 성적을
              AI가 정밀 분석하고, 학습을 체계적으로 관리합니다.
            </p>
          </div>
          <div className="grid lg:grid-cols-2 gap-8 mb-12">
            {/* 생기북 AI */}
            <div className="bg-white border border-gray-200 rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all">
              <div className="w-14 h-14 bg-teal-100 rounded-2xl flex items-center justify-center mb-6">
                <Stethoscope className="h-7 w-7 text-teal-700" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">🩺 의치한 전용 생기북 AI 진단</h3>
              <p className="text-gray-600 mb-6 leading-relaxed">
                의대 입학사정관이 중시하는 생명과학/화학 세특 깊이, 봉사·공감 역량,
                의학적 탐구 경험을 중심으로 생기부를 AI가 정밀 분석합니다.
              </p>
              <div className="bg-gray-50 rounded-xl p-5 space-y-3 mb-6">
                {[
                  { label: "생명과학/화학 세특 깊이", score: 93, color: "bg-teal-500" },
                  { label: "의학적 탐구 · 봉사 역량", score: 90, color: "bg-cyan-500" },
                  { label: "공감능력 · 인성 키워드", score: 87, color: "bg-blue-500" },
                  { label: "학업 역량 (내신 등급)", score: 95, color: "bg-indigo-500" },
                ].map((item) => (
                  <div key={item.label}>
                    <div className="mb-1 flex justify-between text-xs font-semibold text-gray-700">
                      <span>{item.label}</span><span className="text-gray-900">{item.score}점</span>
                    </div>
                    <div className="h-2 w-full overflow-hidden rounded-full bg-gray-200">
                      <div className={`h-full rounded-full ${item.color}`} style={{ width: `${item.score}%` }} />
                    </div>
                  </div>
                ))}
              </div>
              <div className="flex items-center gap-3"><CheckCircle className="h-5 w-5 text-teal-500 flex-shrink-0" /><span className="text-sm text-gray-600">의대/치대/한의대/약대/수의대 맞춤 진단</span></div>
              <div className="flex items-center gap-3 mt-2"><CheckCircle className="h-5 w-5 text-teal-500 flex-shrink-0" /><span className="text-sm text-gray-600">MMI 면접 대비용 인성 키워드 추출</span></div>
            </div>
            {/* 맞춤 플래너 */}
            <div className="bg-white border border-gray-200 rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all">
              <div className="w-14 h-14 bg-cyan-100 rounded-2xl flex items-center justify-center mb-6">
                <Calendar className="h-7 w-7 text-cyan-700" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">📅 의치한 맞춤 Study Planner</h3>
              <p className="text-gray-600 mb-6 leading-relaxed">
                내신 1등급 사수를 위한 정규 학습 + 수능 킬러 문항 대비 +
                봉사/탐구 활동 일정까지 한 곳에서 관리합니다.
              </p>
              <div className="bg-gray-50 rounded-xl p-5 mb-6">
                <div className="relative ml-3 border-l-2 border-gray-200 pl-4">
                  {[
                    { time: "06:00", subj: "생명", title: "유전학 심화 개념 정리", color: "#0d9488", done: true },
                    { time: "10:00", subj: "화학", title: "유기화학 반응 메커니즘", color: "#0891b2", done: false },
                    { time: "15:00", subj: "봉사", title: "요양원 봉사 활동 (생기부 기록)", color: "#7c3aed", done: false },
                    { time: "19:00", subj: "수능", title: "수학 킬러 문항 30제 풀이", color: "#2563eb", done: false },
                  ].map((item) => (
                    <div key={item.title} className="relative mb-4 last:mb-0">
                      <div className="absolute -left-[21px] top-1 h-3 w-3 rounded-full border-2 border-white" style={{ backgroundColor: item.color }} />
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] text-gray-400">{item.time}</span>
                        <span className="rounded px-1.5 py-0.5 text-[10px] font-semibold text-white" style={{ backgroundColor: item.color }}>{item.subj}</span>
                      </div>
                      <p className={`mt-0.5 text-sm font-medium ${item.done ? "text-gray-400 line-through" : "text-gray-800"}`}>{item.title}</p>
                    </div>
                  ))}
                </div>
              </div>
              <div className="flex items-center gap-3"><CheckCircle className="h-5 w-5 text-teal-500 flex-shrink-0" /><span className="text-sm text-gray-600">내신 + 수능 병행 루틴 최적화</span></div>
              <div className="flex items-center gap-3 mt-2"><CheckCircle className="h-5 w-5 text-teal-500 flex-shrink-0" /><span className="text-sm text-gray-600">봉사·탐구 활동 기록 자동 관리</span></div>
            </div>
          </div>
        </div>
      </section>

      {/* 계열별 서비스 */}
      <section className="py-24 bg-gray-50">
        <div className="container mx-auto px-6 max-w-7xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">계열별 맞춤 전략</h2>
            <p className="text-xl text-gray-600">각 계열의 특성에 맞는 입시 전략을 제공합니다</p>
          </div>
          <div className="grid md:grid-cols-3 lg:grid-cols-5 gap-6">
            {[
              { emoji: "🩺", name: "의대", desc: "최상위 내신 + 의학 탐구", color: "teal", highlights: ["내신 1등급 전략", "의학 세특 설계", "MMI 면접 대비"] },
              { emoji: "🦷", name: "치대", desc: "실기 없는 학종/교과 전략", color: "blue", highlights: ["치의학 탐구 설계", "교과 전형 최적화", "면접 준비"] },
              { emoji: "🌿", name: "한의대", desc: "한의학 적성 어필 전략", color: "green", highlights: ["한의학 관심 어필", "생명/화학 세특", "적성 면접 대비"] },
              { emoji: "💊", name: "약대", desc: "약학 계열 복수지원 전략", color: "purple", highlights: ["약학 PEET 대비", "화학 심화 세특", "교과 내신 관리"] },
              { emoji: "🐾", name: "수의대", desc: "동물/생명 탐구 특화", color: "amber", highlights: ["동물 봉사 설계", "생명과학 심화", "수의학 면접"] },
            ].map((item) => (
              <Card key={item.name} className="bg-white border-gray-200 hover:shadow-xl transition-all rounded-xl">
                <CardHeader className="pb-3 text-center">
                  <span className="text-3xl mb-2 block">{item.emoji}</span>
                  <CardTitle className="text-lg font-bold text-gray-900">{item.name}</CardTitle>
                  <CardDescription className="text-xs">{item.desc}</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {item.highlights.map((h) => (
                      <li key={h} className="flex items-center gap-2 text-xs text-gray-600">
                        <CheckCircle className="h-3.5 w-3.5 text-teal-500 flex-shrink-0" />{h}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* 전형 전략 */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-6 max-w-7xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">전형별 합격 전략</h2>
            <p className="text-xl text-gray-600">의치한약수 입시의 모든 전형을 체계적으로 지원합니다</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { title: "수시 교과", icon: <BookOpen className="h-6 w-6 text-teal-600" />, bg: "bg-teal-100", items: ["내신 1등급 관리 전략", "교과 전형 배치표 분석", "최저등급 충족 플랜"] },
              { title: "수시 종합", icon: <Users className="h-6 w-6 text-cyan-600" />, bg: "bg-cyan-100", items: ["생기부 세특 설계", "자소서 작성 컨설팅", "면접(MMI) 실전 대비"] },
              { title: "정시 수능", icon: <Target className="h-6 w-6 text-blue-600" />, bg: "bg-blue-100", items: ["과탐 조합 최적화", "수능 배치표 분석", "킬러 문항 훈련"] },
              { title: "논술 전형", icon: <GraduationCap className="h-6 w-6 text-indigo-600" />, bg: "bg-indigo-100", items: ["수리논술 집중 훈련", "과학논술 첨삭", "최저등급 관리"] },
            ].map((card) => (
              <Card key={card.title} className="bg-white border-gray-200 hover:shadow-xl transition-all rounded-xl">
                <CardHeader className="pb-4">
                  <div className={`w-12 h-12 ${card.bg} rounded-lg flex items-center justify-center mb-4`}>{card.icon}</div>
                  <CardTitle className="text-xl font-bold text-gray-900">{card.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    {card.items.map((it) => (
                      <li key={it} className="flex items-center gap-3 text-sm text-gray-700">
                        <CheckCircle className="h-4 w-4 text-teal-500 flex-shrink-0" />{it}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Contact */}
      <section id="contact" className="py-24 bg-gray-50">
        <div className="container mx-auto px-6 max-w-7xl">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">무료 상담 신청</h2>
            <p className="text-xl text-gray-600 mb-12">의치한약수 합격을 위한 맞춤형 전략을 상담받아보세요</p>
            <div className="grid md:grid-cols-2 gap-6 mb-10">
              <Card className="bg-white border-gray-200 rounded-xl">
                <CardContent className="p-8 text-center">
                  <div className="w-14 h-14 bg-teal-100 rounded-full flex items-center justify-center mx-auto mb-4"><Phone className="h-7 w-7 text-teal-600" /></div>
                  <h3 className="font-bold text-lg mb-3 text-gray-900">전화 상담</h3>
                  <p className="text-2xl font-bold text-teal-600 mb-2">010-2518-7139</p>
                  <p className="text-sm text-gray-600">06:00~22:00</p>
                </CardContent>
              </Card>
              <Card className="bg-white border-gray-200 rounded-xl">
                <CardContent className="p-8 text-center">
                  <div className="w-14 h-14 bg-teal-100 rounded-full flex items-center justify-center mx-auto mb-4"><Mail className="h-7 w-7 text-teal-600" /></div>
                  <h3 className="font-bold text-lg mb-3 text-gray-900">이메일 상담</h3>
                  <p className="text-lg font-semibold text-teal-600 mb-2">withjuno@naver.com</p>
                  <p className="text-sm text-gray-600">24시간 접수</p>
                </CardContent>
              </Card>
            </div>
            <Button size="lg" className="bg-teal-700 hover:bg-teal-800 text-white px-12 py-6 text-lg font-semibold rounded-lg">
              지금 무료 상담 신청하기
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-16">
        <div className="container mx-auto px-6 max-w-7xl">
          <div className="grid md:grid-cols-2 gap-12 mb-12">
            <div>
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-10 h-10 bg-gradient-to-br from-teal-600 to-cyan-700 rounded-lg flex items-center justify-center">
                  <span className="text-white font-black text-[10px]">MED</span>
                </div>
                <span className="text-2xl font-bold">TS 메디컬</span>
              </div>
              <p className="text-sm text-gray-400">의대, 치대, 한의대, 약대, 수의대<br />합격을 위한 전문 입시 컨설팅 + AI 플랫폼</p>
            </div>
            <div className="grid md:grid-cols-2 gap-8 text-xs text-gray-400">
              <div>
                <h5 className="font-semibold mb-3 text-gray-300">거북스쿨</h5>
                <p>대표: 강준호</p>
                <p>사업자등록번호: 772-87-02782</p>
                <p>소재지: 서울 성북구 화랑로 211 벤처창업센터 105</p>
              </div>
              <div>
                <h5 className="font-semibold mb-3 text-gray-300">부설학원 (TS학원)</h5>
                <p className="font-medium text-gray-300">대전지점</p>
                <p>주소: 대전 서구 월평동 286, 6층</p>
                <p>연락처: 042-484-3356, 010-2518-7139</p>
              </div>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-8 text-center text-sm text-gray-500">
            <p>&copy; 2026 TS 메디컬. 모든 권리 보유.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
