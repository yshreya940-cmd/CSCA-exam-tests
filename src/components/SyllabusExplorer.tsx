import React, { useState } from 'react';
import { FileText, Clock, Award, CheckCircle2, ChevronRight, Play, BookOpen, Layers } from 'lucide-react';
import { Subject, Language } from '../types/csca';
import { OFFICIAL_SYLLABI } from '../data/syllabusData';

interface SyllabusExplorerProps {
  lang: Language;
  onLaunchTopicPractice: (subject: Subject, moduleTitle: string) => void;
}

export const SyllabusExplorer: React.FC<SyllabusExplorerProps> = ({
  lang,
  onLaunchTopicPractice,
}) => {
  const isZh = lang === 'zh';
  const [selectedSubject, setSelectedSubject] = useState<Subject>('Mathematics');

  const subjects: Subject[] = [
    'Mathematics', 
    'Physics', 
    'Chemistry', 
    'Science Chinese', 
    'Humanities Chinese', 
    'Professional Chinese'
  ];
  const syllabus = OFFICIAL_SYLLABI[selectedSubject] || OFFICIAL_SYLLABI['Mathematics'];

  return (
    <div className="space-y-8 pb-16 max-w-5xl mx-auto">
      {/* Title & Official Council Header */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-200 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-4">
          <div className="space-y-1">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider bg-blue-100 text-blue-800">
              China Scholarship Council (CSC) Official Document
            </span>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              {isZh ? '2025 版 CSCA 考试大纲与考核指南' : 'CSCA 2025 Official Examination Syllabus'}
            </h1>
            <p className="text-xs sm:text-sm text-slate-500">
              {isZh 
                ? '中国学术水平能力测试 (CSCA) 官方命题范围、各模块考点细则与考试结构'
                : 'Core competencies, modules, and structure for international students entering Chinese universities.'}
            </p>
          </div>
          <span className="text-xs font-mono font-bold text-slate-500 bg-slate-100 px-3 py-1.5 rounded-lg border border-slate-200">
            2025 Edition
          </span>
        </div>

        {/* Subject Navigation Tabs */}
        <div className="flex flex-wrap gap-2 pt-2">
          {subjects.map((subj) => {
            const isSelected = selectedSubject === subj;
            return (
              <button
                key={subj}
                onClick={() => setSelectedSubject(subj)}
                className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center space-x-2 ${
                  isSelected
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                <Layers className="w-4 h-4" />
                <span>{subj}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Syllabus Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-200 space-y-6">
        {/* Exam Structure Grid */}
        <div>
          <h2 className="text-sm font-bold uppercase tracking-wider text-slate-500 mb-3">
            {isZh ? '一、考试形式与结构 (Format and Structure)' : 'I. Examination Format and Structure'}
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200">
              <div className="text-slate-500 text-xs">{isZh ? '考试时长' : 'Duration'}</div>
              <div className="text-base font-bold text-slate-900 mt-1">{syllabus.durationMinutes} Minutes</div>
            </div>
            <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200">
              <div className="text-slate-500 text-xs">{isZh ? '满分总分' : 'Total Score'}</div>
              <div className="text-base font-bold text-slate-900 mt-1">{syllabus.totalPoints} Points</div>
            </div>
            <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200">
              <div className="text-slate-500 text-xs">{isZh ? '试题总数' : 'Questions'}</div>
              <div className="text-base font-bold text-slate-900 mt-1">{syllabus.totalQuestions} Questions</div>
            </div>
            <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200">
              <div className="text-slate-500 text-xs">{isZh ? '题型格式' : 'Question Type'}</div>
              <div className="text-xs font-bold text-blue-700 mt-1 line-clamp-1">{syllabus.questionType}</div>
            </div>
          </div>
        </div>

        {/* Examination Purpose */}
        <div className="bg-blue-50/50 p-5 rounded-2xl border border-blue-200 space-y-2">
          <h3 className="text-xs font-bold text-blue-900 uppercase tracking-wider">
            {isZh ? '二、考核目的 (Examination Purpose)' : 'II. Examination Purpose'}
          </h3>
          <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-medium">
            {syllabus.purposeEn}
          </p>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed pt-2 border-t border-blue-100">
            {syllabus.purposeZh}
          </p>
        </div>

        {/* Content Modules & Topics */}
        <div className="space-y-4">
          <h2 className="text-sm font-bold uppercase tracking-wider text-slate-500">
            {isZh ? '三、考试大纲考核内容与范围 (Content and Scope)' : 'III. Examination Content and Scope'}
          </h2>

          <div className="space-y-4">
            {syllabus.modules.map((mod, modIdx) => (
              <div
                key={modIdx}
                className="bg-slate-50 rounded-2xl p-5 border border-slate-200/80 space-y-3 hover:border-blue-300 transition-all"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200 pb-3">
                  <div className="flex items-center space-x-2.5">
                    <span className="w-6 h-6 rounded-md bg-blue-600 text-white font-bold text-xs flex items-center justify-center">
                      {modIdx + 1}
                    </span>
                    <h3 className="font-bold text-slate-900 text-sm sm:text-base">
                      {isZh ? mod.titleZh : mod.titleEn}
                    </h3>
                  </div>

                  <button
                    onClick={() => onLaunchTopicPractice(selectedSubject, mod.titleEn)}
                    className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold flex items-center gap-1 transition-colors self-start sm:self-auto shadow-2xs"
                  >
                    <Play className="w-3 h-3 fill-white" />
                    <span>{isZh ? '开始专项练习' : 'Practice This Module'}</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs leading-relaxed">
                  <div className="space-y-1.5">
                    <div className="font-semibold text-slate-500">{isZh ? '英文大纲细则:' : 'English Syllabus Detail:'}</div>
                    <ul className="space-y-1 text-slate-700 list-disc list-inside">
                      {mod.itemsEn.map((item, idx) => (
                        <li key={idx} className="pl-1">{item}</li>
                      ))}
                    </ul>
                  </div>

                  <div className="space-y-1.5 bg-white p-3 rounded-xl border border-slate-100">
                    <div className="font-semibold text-slate-500">{isZh ? '中文大纲细则:' : 'Chinese Syllabus Detail:'}</div>
                    <ul className="space-y-1 text-slate-700 list-disc list-inside">
                      {mod.itemsZh.map((item, idx) => (
                        <li key={idx} className="pl-1">{item}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
