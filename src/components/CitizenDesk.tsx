import React, { useState } from 'react';
import {
  FileText,
  PhoneCall,
  Printer,
  Copy,
  Check,
  Building2,
  Calendar,
  User,
  MapPin,
  AlertTriangle,
  Download,
  ShieldCheck,
  CheckCircle2,
} from 'lucide-react';
import { BANGLADESH_DISTRICTS, NATIONAL_HOTLINES } from '../data/mockData';
import { GDFormData, LeaveFormData } from '../types';

export const CitizenDesk: React.FC = () => {
  const [activeSubTab, setActiveSubTab] = useState<'gd' | 'leave' | 'hotlines'>('gd');
  const [copied, setCopied] = useState<boolean>(false);

  // GD Form State
  const [gdForm, setGdForm] = useState<GDFormData>({
    district: BANGLADESH_DISTRICTS[0].district,
    thana: BANGLADESH_DISTRICTS[0].thanas[0],
    applicantName: 'মোহাম্মদ শেখ ফরিদ',
    fatherName: 'মরহুম মোঃ নূরুল ইসলাম',
    motherName: 'মোসাঃ ফাতেমা বেগম',
    nidOrBirthNo: '19951234567890123',
    mobile: '01711-234567',
    presentAddress: 'বাড়ি নং ১২, রোড নং ৫, ধানমন্ডি, ঢাকা',
    permanentAddress: 'গ্রাম: চর রামদাস, ডাকঘর: রামদাস, সদর, নোয়াখালী',
    incidentDate: new Date().toISOString().split('T')[0],
    incidentTime: 'আনুমানিক সকাল ১০:৩০ ঘটিকা',
    incidentPlace: 'শাহবাগ মোড় থেকে ফার্মগেট যাওয়ার পথে গণপরিবহনে',
    itemType: 'nid',
    itemDetails: 'স্মার্ট জাতীয় পরিচয়পত্র (NID No: 19951234567890123), ইস্যুকারী কর্তৃপক্ষ: বাংলাদেশ নির্বাচন কমিশন।',
    generalDescription: 'অনিবার্য কারণবশত উল্লিখিত তারিখে বাসে যাতায়াতকালে আমার মানিব্যাগসহ জরুরি উক্ত পরিচয়পত্রটি অসাবধানতাবশত হারিয়ে যায়। সম্ভাব্য সকল স্থানে খোঁজাখুঁজি করিয়াও কোনো সন্ধান পাই নাই। বিধায় ভবিষ্যতের কোনো অপব্যবহার বা প্রতারণা রোধকল্পে বিষয়টি সাধারণ ডায়েরিভুক্ত করার অনুরোধ জানাচ্ছি।',
  });

  // Leave Form State
  const [leaveForm, setLeaveForm] = useState<LeaveFormData>({
    officeName: 'তথ্য ও যোগাযোগ প্রযুক্তি বিভাগ, ডাক ও টেলিযোগাযোগ মন্ত্রণালয়',
    designation: 'সিনিয়র সিস্টেম অ্যানালিস্ট / সফটওয়্যার আর্কিটেক্ট',
    applicantName: 'মোহাম্মদ শেখ ফরিদ',
    leaveType: 'casual',
    startDate: new Date().toISOString().split('T')[0],
    endDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    totalDays: 3,
    reason: 'জরুরি পারিবারিক প্রয়োজন ও চিকিৎসার জন্য উপস্থিত থাকা আবশ্যক।',
    addressDuringLeave: 'বাসা নং ১২, ধানমন্ডি আ/এ, ঢাকা (মোবাইল: 01711-234567)',
    emergencyContact: '01812-345678 (পরিবারের সদস্য)',
  });

  const selectedDistrictData =
    BANGLADESH_DISTRICTS.find((d) => d.district === gdForm.district) || BANGLADESH_DISTRICTS[0];

  const handleDistrictChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const distName = e.target.value;
    const distObj = BANGLADESH_DISTRICTS.find((d) => d.district === distName) || BANGLADESH_DISTRICTS[0];
    setGdForm({
      ...gdForm,
      district: distName,
      thana: distObj.thanas[0] || '',
    });
  };

  // Generate Official Bangladesh Police GD Document Text
  const generateGDText = (): string => {
    return `বরাবর,
অফিসার ইনচার্জ (OC)
${gdForm.thana}
${selectedDistrictData.districtBn} জেলা।

বিষয়: হারানো সংক্রান্ত সাধারণ ডায়েরি (জিডি) করার আবেদন।

মহোদয়,
বিনীত নিবেদন এই যে, আমি নিম্নস্বাক্ষরকারী ${gdForm.applicantName}, পিতা: ${gdForm.fatherName}, মাতা: ${gdForm.motherName}, জাতীয় পরিচয়পত্র নম্বর: ${gdForm.nidOrBirthNo}, বর্তমান ঠিকানা: ${gdForm.presentAddress}, স্থায়ী ঠিকানা: ${gdForm.permanentAddress}, মোবাইল নম্বর: ${gdForm.mobile}—এই মর্মে জানাচ্ছি যে,

বিগত ${gdForm.incidentDate} তারিখ ${gdForm.incidentTime}-এ ${gdForm.incidentPlace} এলাকায় আমার নিম্নবর্ণিত প্রয়োজনীয় জিনিসপত্রটি হারিয়ে যায়:

হারানো দ্রব্যের বিবরণ:
• শ্রেণি: ${
      gdForm.itemType === 'nid'
        ? 'জাতীয় পরিচয়পত্র (NID)'
        : gdForm.itemType === 'mobile'
        ? 'মোবাইল ফোন ও সিম কার্ড'
        : gdForm.itemType === 'license'
        ? 'ড্রাইভিং লাইসেন্স'
        : gdForm.itemType === 'passport'
        ? 'আন্তর্জাতিক পাসপোর্ট'
        : 'জরুরি সরকারি নথি'
    }
• শনাক্তকরণ তথ্য: ${gdForm.itemDetails}

ঘটনার সংক্ষিপ্ত বিবরণ:
${gdForm.generalDescription}

অতএব, জনাবের নিকট আকুল প্রার্থনা, উক্ত ঘটনাটি আপনার থানার দৈনন্দিন সাধারণ ডায়েরিতে (জিডি) নথিভুক্ত করত: একটি অনুলিপি আমাকে প্রদান করে বাধিত করবেন, যেন ভবিষ্যতে কোনো অপরাধমূলক অপব্যবহারের দায়ভার আমার ওপর না বর্তায়।

বিনীত নিবেদক,

(${gdForm.applicantName})
মোবাইল: ${gdForm.mobile}
তারিখ: ${new Date().toLocaleDateString('bn-BD')}
জাতীয় পরিচয়পত্র: ${gdForm.nidOrBirthNo}`;
  };

  // Generate Official Administrative Leave Application Text
  const generateLeaveText = (): string => {
    const leaveName =
      leaveForm.leaveType === 'casual'
        ? 'নৈমিত্তিক ছুটি (Casual Leave)'
        : leaveForm.leaveType === 'medical'
        ? 'চিকিৎসাজনিত ছুটি (Medical Leave)'
        : leaveForm.leaveType === 'earned'
        ? 'অর্জিত ছুটি (Earned Leave)'
        : 'বিশেষ ছুটি';

    return `তারিখ: ${new Date().toLocaleDateString('bn-BD')}

বরাবর,
যথাযথ কর্তৃপক্ষ / বিভাগীয় প্রধান
${leaveForm.officeName}

বিষয়: ${leaveName}-এর জন্য আবেদন।

মহোদয়,
যথাবিহিত সম্মান প্রদর্শনপূর্বক বিনীত নিবেদন এই যে, আমি নিম্নস্বাক্ষরকারী আপনার অধীনস্থ দপ্তরের ${leaveForm.designation} হিসেবে কর্মরত আছি। ${leaveForm.reason}

এমতাবস্থায়, আমার আগামী ${leaveForm.startDate} তারিখ হইতে ${leaveForm.endDate} তারিখ পর্যন্ত মোট ০${leaveForm.totalDays} (তিন) দিনের ${leaveName} মঞ্জুর করার জন্য বিনীত প্রার্থনা জানাচ্ছি।

ছুটিকালীন অবস্থানের ঠিকানা ও যোগাযোগ:
• অবস্থান: ${leaveForm.addressDuringLeave}
• জরুরি যোগাযোগ নম্বর: ${leaveForm.emergencyContact}

অতএব, বিনীত প্রার্থনা এই যে, উপরোক্ত বিষয়টি সদয় বিবেচনাপূর্বক আমাকে উক্ত ০${leaveForm.totalDays} দিনের ছুটি ভোগের অনুমতি প্রদান করিতে মর্জি হয়।

বিনীত নিবেদক,

(${leaveForm.applicantName})
পদবী: ${leaveForm.designation}
${leaveForm.officeName}`;
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const currentDocumentText = activeSubTab === 'gd' ? generateGDText() : generateLeaveText();

  return (
    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6">
      {/* Sub Tabs Bar */}
      <div className="mb-6 flex flex-col justify-between gap-4 border-b border-slate-800 pb-5 sm:flex-row sm:items-center">
        <div>
          <div className="flex items-center gap-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-500/20 text-amber-400 border border-amber-500/30">
              <Building2 className="h-5 w-5" />
            </span>
            <h2 className="text-xl font-bold text-white sm:text-2xl">
              সার্ভিস সরকার (CitizenDesk BD)
            </h2>
          </div>
          <p className="mt-1 text-sm text-slate-400">
            বাংলাদেশ পুলিশ স্ট্যান্ডার্ড অনলাইন জিডি খসড়া, প্রশাসনিক ছুটির আবেদনপত্র ও জরুরি জাতীয় হটলাইন ডিরেক্টরি।
          </p>
        </div>

        {/* Tab switchers */}
        <div className="flex rounded-xl border border-slate-800 bg-slate-900 p-1">
          <button
            onClick={() => setActiveSubTab('gd')}
            className={`flex items-center gap-1.5 rounded-lg px-3.5 py-1.5 text-xs font-semibold transition-all ${
              activeSubTab === 'gd'
                ? 'bg-amber-500/20 text-amber-300 ring-1 ring-amber-500/40'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <FileText className="h-3.5 w-3.5" />
            <span>অনলাইন জিডি (GD)</span>
          </button>
          <button
            onClick={() => setActiveSubTab('leave')}
            className={`flex items-center gap-1.5 rounded-lg px-3.5 py-1.5 text-xs font-semibold transition-all ${
              activeSubTab === 'leave'
                ? 'bg-amber-500/20 text-amber-300 ring-1 ring-amber-500/40'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Calendar className="h-3.5 w-3.5" />
            <span>ছুটির আবেদনপত্র</span>
          </button>
          <button
            onClick={() => setActiveSubTab('hotlines')}
            className={`flex items-center gap-1.5 rounded-lg px-3.5 py-1.5 text-xs font-semibold transition-all ${
              activeSubTab === 'hotlines'
                ? 'bg-amber-500/20 text-amber-300 ring-1 ring-amber-500/40'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <PhoneCall className="h-3.5 w-3.5" />
            <span>জরুরি হটলাইন (৯৯৯)</span>
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      {activeSubTab === 'hotlines' ? (
        /* Emergency National Hotlines Directory */
        <div className="space-y-6">
          <div className="rounded-xl border border-red-500/30 bg-red-950/20 p-4 text-xs text-red-200 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-red-400 shrink-0" />
              <span>
                জরুরি জাতীয় সেবা নম্বরসমূহে কল করার জন্য কোনো প্রকার ব্যালেন্স বা টাকার প্রয়োজন হয় না (টোল ফ্রি)।
              </span>
            </div>
            <span className="hidden sm:inline font-mono font-bold text-red-300">Toll-Free 24/7</span>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {NATIONAL_HOTLINES.map((hotline) => (
              <div
                key={hotline.number}
                className="group relative flex flex-col justify-between rounded-xl border border-slate-800 bg-slate-900/80 p-5 transition-all hover:border-slate-700 hover:bg-slate-900 hover:shadow-xl"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span
                      className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${
                        hotline.isEmergency
                          ? 'bg-red-500/20 text-red-400 border border-red-500/30'
                          : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                      }`}
                    >
                      {hotline.category}
                    </span>
                    <span className="text-[11px] text-slate-400">{hotline.available}</span>
                  </div>

                  <div className="mt-3">
                    <span className="text-3xl font-extrabold tracking-tight text-white font-mono group-hover:text-emerald-400 transition-colors">
                      {hotline.number}
                    </span>
                    <h3 className="mt-1 text-base font-bold text-slate-100">
                      {hotline.titleBn}
                    </h3>
                    <p className="mt-1 text-xs text-slate-400 leading-relaxed">
                      {hotline.description}
                    </p>
                  </div>
                </div>

                <div className="mt-5 border-t border-slate-800/80 pt-3">
                  <a
                    href={`tel:${hotline.number}`}
                    className="flex w-full items-center justify-center gap-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 py-2.5 text-xs font-bold text-white shadow-md transition-colors"
                  >
                    <PhoneCall className="h-3.5 w-3.5" />
                    <span>সরাসরি কল করুন ({hotline.number})</span>
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        /* Form & Document Live Preview Split View */
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
          {/* Form Input Side */}
          <div className="space-y-4 lg:col-span-5">
            <div className="rounded-xl border border-slate-800 bg-slate-900/90 p-5 shadow-lg space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <ShieldCheck className="h-4 w-4 text-emerald-400" />
                  <span>
                    {activeSubTab === 'gd' ? 'জিডি তথ্য ফরম' : 'ছুটির বিবরণ ফরম'}
                  </span>
                </h3>
                <span className="text-[11px] text-slate-400">লাইভ আপডেট</span>
              </div>

              {activeSubTab === 'gd' ? (
                /* GD Form Inputs */
                <div className="space-y-3 text-xs">
                  {/* District & Thana */}
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="text-slate-400 font-medium">জেলা:</label>
                      <select
                        value={gdForm.district}
                        onChange={handleDistrictChange}
                        className="mt-1 w-full rounded-lg border border-slate-800 bg-slate-950 p-2 text-slate-100 focus:border-amber-500 focus:outline-none"
                      >
                        {BANGLADESH_DISTRICTS.map((d) => (
                          <option key={d.district} value={d.district}>
                            {d.districtBn} ({d.district})
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="text-slate-400 font-medium">থানা:</label>
                      <select
                        value={gdForm.thana}
                        onChange={(e) => setGdForm({ ...gdForm, thana: e.target.value })}
                        className="mt-1 w-full rounded-lg border border-slate-800 bg-slate-950 p-2 text-slate-100 focus:border-amber-500 focus:outline-none"
                      >
                        {selectedDistrictData.thanas.map((th) => (
                          <option key={th} value={th}>
                            {th}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Item Type */}
                  <div>
                    <label className="text-slate-400 font-medium">হারানোর বিষয়/ক্যাটাগরি:</label>
                    <select
                      value={gdForm.itemType}
                      onChange={(e) => setGdForm({ ...gdForm, itemType: e.target.value as any })}
                      className="mt-1 w-full rounded-lg border border-slate-800 bg-slate-950 p-2 text-slate-100 focus:border-amber-500 focus:outline-none"
                    >
                      <option value="nid">জাতীয় পরিচয়পত্র (NID)</option>
                      <option value="mobile">মোবাইল ফোন ও সিম কার্ড</option>
                      <option value="license">ড্রাইভিং লাইসেন্স</option>
                      <option value="passport">পাসপোর্ট</option>
                      <option value="certificate">শিক্ষাগত সনদ / সার্টিফিকেট</option>
                      <option value="cheque">ব্যাংক চেক বই</option>
                      <option value="other">অন্যান্য জরুরি নথি</option>
                    </select>
                  </div>

                  {/* Applicant Name & Mobile */}
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="text-slate-400 font-medium">আবেদনকারীর নাম:</label>
                      <input
                        type="text"
                        value={gdForm.applicantName}
                        onChange={(e) => setGdForm({ ...gdForm, applicantName: e.target.value })}
                        className="mt-1 w-full rounded-lg border border-slate-800 bg-slate-950 p-2 text-slate-100 focus:border-amber-500 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="text-slate-400 font-medium">মোবাইল নম্বর:</label>
                      <input
                        type="text"
                        value={gdForm.mobile}
                        onChange={(e) => setGdForm({ ...gdForm, mobile: e.target.value })}
                        className="mt-1 w-full rounded-lg border border-slate-800 bg-slate-950 p-2 text-slate-100 focus:border-amber-500 focus:outline-none"
                      />
                    </div>
                  </div>

                  {/* Parents */}
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="text-slate-400 font-medium">পিতার নাম:</label>
                      <input
                        type="text"
                        value={gdForm.fatherName}
                        onChange={(e) => setGdForm({ ...gdForm, fatherName: e.target.value })}
                        className="mt-1 w-full rounded-lg border border-slate-800 bg-slate-950 p-2 text-slate-100 focus:border-amber-500 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="text-slate-400 font-medium">মাতার নাম:</label>
                      <input
                        type="text"
                        value={gdForm.motherName}
                        onChange={(e) => setGdForm({ ...gdForm, motherName: e.target.value })}
                        className="mt-1 w-full rounded-lg border border-slate-800 bg-slate-950 p-2 text-slate-100 focus:border-amber-500 focus:outline-none"
                      />
                    </div>
                  </div>

                  {/* NID / Birth Reg */}
                  <div>
                    <label className="text-slate-400 font-medium">এনআইডি নম্বর:</label>
                    <input
                      type="text"
                      value={gdForm.nidOrBirthNo}
                      onChange={(e) => setGdForm({ ...gdForm, nidOrBirthNo: e.target.value })}
                      className="mt-1 w-full rounded-lg border border-slate-800 bg-slate-950 p-2 text-slate-100 focus:border-amber-500 focus:outline-none"
                    />
                  </div>

                  {/* Incident Place & Time */}
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="text-slate-400 font-medium">হারানোর স্থান:</label>
                      <input
                        type="text"
                        value={gdForm.incidentPlace}
                        onChange={(e) => setGdForm({ ...gdForm, incidentPlace: e.target.value })}
                        className="mt-1 w-full rounded-lg border border-slate-800 bg-slate-950 p-2 text-slate-100 focus:border-amber-500 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="text-slate-400 font-medium">তারিখ ও সময়:</label>
                      <input
                        type="text"
                        value={gdForm.incidentTime}
                        onChange={(e) => setGdForm({ ...gdForm, incidentTime: e.target.value })}
                        className="mt-1 w-full rounded-lg border border-slate-800 bg-slate-950 p-2 text-slate-100 focus:border-amber-500 focus:outline-none"
                      />
                    </div>
                  </div>

                  {/* Item Identifiers */}
                  <div>
                    <label className="text-slate-400 font-medium">হারানো সামগ্রীর বিবরণ ও নম্বর:</label>
                    <input
                      type="text"
                      value={gdForm.itemDetails}
                      onChange={(e) => setGdForm({ ...gdForm, itemDetails: e.target.value })}
                      className="mt-1 w-full rounded-lg border border-slate-800 bg-slate-950 p-2 text-slate-100 focus:border-amber-500 focus:outline-none"
                    />
                  </div>
                </div>
              ) : (
                /* Leave Form Inputs */
                <div className="space-y-3 text-xs">
                  <div>
                    <label className="text-slate-400 font-medium">দপ্তর / মন্ত্রণালয় / প্রতিষ্ঠানের নাম:</label>
                    <input
                      type="text"
                      value={leaveForm.officeName}
                      onChange={(e) => setLeaveForm({ ...leaveForm, officeName: e.target.value })}
                      className="mt-1 w-full rounded-lg border border-slate-800 bg-slate-950 p-2 text-slate-100 focus:border-amber-500 focus:outline-none"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="text-slate-400 font-medium">কর্মকর্তা/কর্মচারীর নাম:</label>
                      <input
                        type="text"
                        value={leaveForm.applicantName}
                        onChange={(e) => setLeaveForm({ ...leaveForm, applicantName: e.target.value })}
                        className="mt-1 w-full rounded-lg border border-slate-800 bg-slate-950 p-2 text-slate-100 focus:border-amber-500 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="text-slate-400 font-medium">পদবী:</label>
                      <input
                        type="text"
                        value={leaveForm.designation}
                        onChange={(e) => setLeaveForm({ ...leaveForm, designation: e.target.value })}
                        className="mt-1 w-full rounded-lg border border-slate-800 bg-slate-950 p-2 text-slate-100 focus:border-amber-500 focus:outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-slate-400 font-medium">ছুটির ধরণ:</label>
                    <select
                      value={leaveForm.leaveType}
                      onChange={(e) => setLeaveForm({ ...leaveForm, leaveType: e.target.value as any })}
                      className="mt-1 w-full rounded-lg border border-slate-800 bg-slate-950 p-2 text-slate-100 focus:border-amber-500 focus:outline-none"
                    >
                      <option value="casual">নৈমিত্তিক ছুটি (Casual Leave)</option>
                      <option value="earned">অর্জিত ছুটি (Earned Leave)</option>
                      <option value="medical">চিকিৎসা ছুটি (Medical Leave)</option>
                      <option value="maternity">মাতৃত্বকালীন ছুটি</option>
                      <option value="special">বিশেষ ছুটি</option>
                    </select>
                  </div>

                  <div className="grid grid-cols-3 gap-2">
                    <div>
                      <label className="text-slate-400 font-medium">শুরুর তারিখ:</label>
                      <input
                        type="date"
                        value={leaveForm.startDate}
                        onChange={(e) => setLeaveForm({ ...leaveForm, startDate: e.target.value })}
                        className="mt-1 w-full rounded-lg border border-slate-800 bg-slate-950 p-2 text-slate-100 focus:border-amber-500 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="text-slate-400 font-medium">শেষের তারিখ:</label>
                      <input
                        type="date"
                        value={leaveForm.endDate}
                        onChange={(e) => setLeaveForm({ ...leaveForm, endDate: e.target.value })}
                        className="mt-1 w-full rounded-lg border border-slate-800 bg-slate-950 p-2 text-slate-100 focus:border-amber-500 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="text-slate-400 font-medium">মোট দিন:</label>
                      <input
                        type="number"
                        min={1}
                        value={leaveForm.totalDays}
                        onChange={(e) => setLeaveForm({ ...leaveForm, totalDays: Number(e.target.value) })}
                        className="mt-1 w-full rounded-lg border border-slate-800 bg-slate-950 p-2 text-slate-100 focus:border-amber-500 focus:outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-slate-400 font-medium">ছুটির কারণ:</label>
                    <textarea
                      rows={2}
                      value={leaveForm.reason}
                      onChange={(e) => setLeaveForm({ ...leaveForm, reason: e.target.value })}
                      className="mt-1 w-full rounded-lg border border-slate-800 bg-slate-950 p-2 text-slate-100 focus:border-amber-500 focus:outline-none"
                    />
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Document Preview Side (Print Ready) */}
          <div className="space-y-4 lg:col-span-7">
            <div className="rounded-xl border border-slate-800 bg-slate-900/90 p-5 shadow-xl">
              <div className="no-print mb-4 flex flex-wrap items-center justify-between gap-2 border-b border-slate-800 pb-3">
                <div className="flex items-center gap-2">
                  <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/20">
                    <FileText className="h-4 w-4" />
                  </span>
                  <div>
                    <h3 className="text-base font-bold text-white">
                      অফিসিয়াল ডকুমেন্ট প্রিভিউ
                    </h3>
                    <p className="text-[11px] text-slate-400">
                      গণপ্রজাতন্ত্রী বাংলাদেশ সরকারের ফরম্যাট নির্দেশিকা অনুযায়ী
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => copyToClipboard(currentDocumentText)}
                    className="flex items-center gap-1.5 rounded-lg border border-slate-700 bg-slate-800 hover:bg-slate-700 px-3 py-1.5 text-xs font-semibold text-slate-200 transition-colors"
                  >
                    {copied ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
                    <span>{copied ? 'কপি হয়েছে' : 'অনুলিপি কপি'}</span>
                  </button>
                  <button
                    onClick={() => window.print()}
                    className="flex items-center gap-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 px-3.5 py-1.5 text-xs font-bold text-white shadow-md transition-colors"
                  >
                    <Printer className="h-3.5 w-3.5" />
                    <span>প্রিন্ট / PDF সংরক্ষণ</span>
                  </button>
                </div>
              </div>

              {/* Printable Official Sheet */}
              <div className="print-area rounded-xl border border-slate-700 bg-white p-8 text-black shadow-inner font-serif text-sm leading-relaxed antialiased">
                {/* Official Crest Header */}
                <div className="mb-6 border-b border-gray-300 pb-4 text-center">
                  <div className="inline-block rounded-full border border-gray-400 px-3 py-1 text-[11px] font-bold text-gray-800 uppercase tracking-widest">
                    {activeSubTab === 'gd'
                      ? 'বাংলাদেশ পুলিশ • অনলাইন জিডি উইং'
                      : 'গণপ্রজাতন্ত্রী বাংলাদেশ সরকার'}
                  </div>
                  <h4 className="mt-2 text-lg font-bold text-gray-900">
                    {activeSubTab === 'gd'
                      ? `সাধারণ ডায়েরি (জিডি) আবেদন খসড়া`
                      : `প্রশাসনিক ছুটির আনুষ্ঠানিক আবেদনপত্র`}
                  </h4>
                  <p className="text-xs text-gray-600">
                    {activeSubTab === 'gd'
                      ? `থানা: ${gdForm.thana}, জেলা: ${selectedDistrictData.districtBn}`
                      : leaveForm.officeName}
                  </p>
                </div>

                {/* Preformatted Document Text */}
                <div className="whitespace-pre-wrap font-sans text-gray-900 text-sm leading-relaxed">
                  {currentDocumentText}
                </div>

                {/* Verification Stamp Footer */}
                <div className="mt-8 border-t border-gray-200 pt-4 flex items-center justify-between text-[11px] text-gray-500 font-mono">
                  <span>ডকুমেন্ট আইডি: BD-GOV-{Date.now().toString().slice(-8)}</span>
                  <span>স্বাক্ষরিত ডিজিটাল কপি প্রযোজ্য</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
