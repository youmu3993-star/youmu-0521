import { examCases } from '@/lib/exam-cases';
import type { ExamQuestion } from '@/lib/types';

export default function ExamCases({questions,onQuestion,onText}:{questions:ExamQuestion[];onQuestion:(q:ExamQuestion)=>void;onText:(id:string)=>void}){
 const card=(c:typeof examCases[number])=>{
  const q=questions.find(item=>item.id===c.id);
  return <article key={c.id} className="original-case">
   <div className="case-source-line"><small>{c.year} · 第 {q?.number} 题</small><span>原句考查</span></div>
   <h4>原题这样问</h4><blockquote className="case-prompt">{q?.body||'原题资料暂未开放'}</blockquote>
   <div className="case-answer"><small>参考答案 · 直接看</small>{c.answer}</div>
   <div className="case-clue"><b>题干线索</b><span>{c.clue}</span></div>
   <div className="case-steps"><p><b>原文定位</b>{c.locate}</p><p><b>判断依据</b>{c.why}</p></div>
   <p className="case-trap"><b>易错提醒</b>{c.trap}</p>
   <div className="case-actions"><button onClick={()=>onText(c.annotationId)}>回原文看句子 →</button>{q&&<button onClick={()=>onQuestion(q)}>看题源与完整解析 →</button>}</div>
  </article>;
 };
 return <section className="exam-cases" aria-label="真题原题与拆解">
  <div className="case-header"><span>真题原题 · 对照着读</span><h3>同一段原文，题干换一个限定词，答案就会变。</h3><p>直接读原题，再看提示词怎样指向课文。填空横线仅作网页排版统一；卷别、版本和来源见题源卡。</p></div>
  <div className="case-pair">{examCases.slice(0,2).map(card)}</div>
  <div className="case-takeaway"><strong>迁移一步</strong><span>先找对象，再找动作和结果，最后逐字核对设空范围。相同篇章不等于相同答案。</span></div>
  <details className="case-more"><summary>再看两个原题：蚯蚓的结果、木材变化的成因</summary><div>{examCases.slice(2).map(card)}</div></details>
  <p className="case-provenance">本站依据用户提供的试卷资料转录设问，并标明资料页码。转载授权尚未确认，正式原卷核验状态另行显示；教学拆解不是官方评分标准。</p>
 </section>;
}
