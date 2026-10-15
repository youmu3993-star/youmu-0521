import { examGuides, type ReadingScaffold } from '@/lib/exam-guides';
import { seedQuestions } from '@/lib/exams';
import { embeddedOriginals } from '@/lib/embedded-originals';
import type { ExamQuestion } from '@/lib/types';
import ExamCheck from './exam-check';

function Scaffold({ scaffold }: { scaffold: ReadingScaffold }) {
  return <section className="guide-scaffold" aria-label={scaffold.title}>
    <div className="guide-section-title"><span>{scaffold.kind}</span><h4>{scaffold.title}</h4></div>
    <p>{scaffold.purpose}</p>
    <div className={`scaffold-steps ${scaffold.kind === '对比图' ? 'compare' : ''}`}>
      {scaffold.items.map((item, index) => <div className="scaffold-step" key={`${item.label}-${index}`}>
        <b>{item.label}</b><span>{item.text}</span>
      </div>)}
    </div>
  </section>;
}

export function hasExamGuide(question: ExamQuestion) {
  const seed = seedQuestions.find(q => q.id === question.id);
  const original = embeddedOriginals[question.id];
  return Boolean(original && question.body === original.body && question.reference === original.reference && seed && seed.title === question.title && seed.paperId === question.paperId && seed.number === question.number && examGuides[question.id]);
}

export default function ExamGuide({ question }: { question: ExamQuestion }) {
  const guide = hasExamGuide(question) ? examGuides[question.id] : undefined;

  if (!guide) return <section className="teacher-guide guide-fallback">
    <h3>参考答案与解析</h3>
    {question.reference ? <p className="guide-answer">{question.reference}</p> : <p>这条档案尚无可核对的参考答案。</p>}
    <p>逐点依据和示范表达尚待编校；请结合题源核验，不能把本站解析当作官方评分说明。</p>
  </section>;

  return <section className="teacher-guide" aria-label="逐点讲解">
    <header className="teacher-guide-header"><div><small>从题干走回原文</small><h3>{guide.kind === 'essay' ? '作文：从立意到一段表达' : '参考答案与逐点依据'}</h3></div><span>本站编写 · 教师审阅待完成</span></header>
    {guide.kind === 'objective' ? <>
      <div className="guide-answer-box"><small>参考答案 · 直接看</small><p className="guide-answer">{question.reference ?? guide.answer}</p><span>{guide.answerBasis}</span></div>
      <div className="guide-section-title"><span>01</span><h4>题干提示怎样指向答案</h4></div>
      <div className="guide-points">{guide.points.map((point, index) => <div className="guide-point" key={point.clue}>
        <span className="guide-point-number">{index + 1}</span><div><b>{point.clue}</b><p><strong>原文依据</strong> {point.evidence}</p><p>{point.why}</p></div>
      </div>)}</div>
      <div className="guide-model"><strong>示范说法</strong><p>{guide.modelExpression}</p></div>
    </> : <>
      <div className="guide-answer-box"><small>立意示范 · 可有不同答案</small><p className="guide-answer">{guide.position}</p><span>这不是标准答案，也未获公开点评教师审阅。</span></div>
      <div className="guide-section-title"><span>01</span><h4>把课文证据接到题目上</h4></div>
      <div className="guide-evidence"><b>原文依据</b><p>{guide.originalEvidence}</p><b>怎么连接</b><p>{guide.bridge}</p><small>{guide.relation}</small></div>
      <div className="guide-section-title"><span>02</span><h4>可借鉴的表达段落</h4></div>
      <div className="guide-comparison"><h4>先看一句话差在哪里</h4><div><span>只贴名言</span><p>“荀子说‘善假于物’，所以 AI 会让问题越来越多。”</p><small>原句只证明借助外物能扩大能力，不能直接推出问题数量的变化。</small></div><div><span>把中间推理补上</span><p>“工具帮我更快查到‘假’的词义；但这个解释是否适合《劝学》的上下文，仍要回到原文判断。”</p><small>写清工具解决了哪一问，以及人还要判断什么，再回到作文题。</small></div></div>
      <blockquote className="guide-paragraph">{guide.modelParagraph}</blockquote>
      <p className="guide-attribution">本站原创示范段落，供观察论证方法；不建议整段照搬。</p>
    </>}
    <section className="guide-criteria"><div className="guide-section-title"><span>{guide.kind === 'essay' ? '03' : '02'}</span><h4>本站参考评价维度</h4></div>
      <ul>{guide.criteria.map(item => <li key={item}>{item}</li>)}</ul>
      {guide.kind === 'essay' && <p className="guide-alternate">另一条合理思路：{guide.alternate}</p>}
      <small>用于学习自查，不是原卷官方评分细则，也不预设唯一写法。</small>
    </section>
    <ExamCheck key={question.id} questionId={question.id} />
    <details className="guide-scaffold-disclosure"><summary>需要时再看：{guide.scaffold.title}</summary><Scaffold scaffold={guide.scaffold} /></details>
    {guide.kind === 'objective' && <p className="guide-relation">{guide.relation}</p>}
    {!!guide.sources?.length && <details className="guide-sources"><summary>查看公开参考来源与审核边界</summary><ul>{guide.sources.map(source => <li key={source.url}><a href={source.url} target="_blank" rel="noreferrer">{source.title}</a><small>{source.note}</small></li>)}</ul></details>}
  </section>;
}
