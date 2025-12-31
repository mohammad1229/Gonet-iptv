
import React, { useState, useEffect } from 'react';
import { Shield, ArrowRight, AlertCircle, Hash, Heart, Waves, Sun, Flame, TreePine, Map, PhoneCall } from 'lucide-react';
import { UserAccount } from '../types';

interface LoginProps {
  onLogin: (user: UserAccount) => void;
}

const Logo: React.FC<{ className?: string }> = ({ className = "w-16 h-16" }) => {
  return (
    <div className={`${className} bg-gradient-to-br from-blue-600 to-blue-800 rounded-3xl flex items-center justify-center shadow-2xl relative overflow-hidden border border-white/20 group-hover:scale-110 transition-transform duration-500`}>
      <div className={`absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width="20" height="20" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"%3E%3Cpath d="M0 0l20 20L40 0H0zm0 40l20-20 20 20H0z" fill="%23ffffff" fill-opacity="0.05"/%3E%3C/svg%3E')] opacity-20`}></div>
      <span className="text-white font-black text-3xl italic relative z-10 select-none">G</span>
    </div>
  );
};

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [formData, setFormData] = useState({ activationCode: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const inputCode = formData.activationCode.trim();

    setTimeout(() => {
      // كود المدير Gonet1229 - اشتراك دائم
      if (inputCode.toLowerCase() === 'gonet1229') {
        onLogin({
          id: 'admin-master',
          username: 'admin',
          password: inputCode,
          expiry: 'دائم',
          plan: 'Premium',
          status: 'Active',
          createdAt: new Date().toISOString()
        });
        return;
      }

      const savedUsers = localStorage.getItem('gonet_users');
      const users: UserAccount[] = savedUsers ? JSON.parse(savedUsers) : [];
      const foundUser = users.find((u) => u.password === inputCode);

      if (foundUser) {
        onLogin(foundUser);
      } else {
        setError('كود التفعيل غير صحيح. ننتظرك بكل فخر.');
        setLoading(false);
      }
    }, 1500);
  };

  return (
    <div className="min-h-screen text-white flex items-center justify-center p-4 relative font-sans overflow-hidden" dir="rtl">
      {/* زينة التطريز الجانبية */}
      <div className="absolute top-0 bottom-0 left-0 w-2 opacity-30 bg-repeat-y" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg width='10' height='40' viewBox='0 0 10 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0 0 L10 10 L0 20 L10 30 L0 40' stroke='%23EE2D23' stroke-width='2' fill='none'/%3E%3C/svg%3E")` }}></div>
      <div className="absolute top-0 bottom-0 right-0 w-2 opacity-30 bg-repeat-y" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg width='10' height='40' viewBox='0 0 10 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M10 0 L0 10 L10 20 L0 30 L10 40' stroke='%23009736' stroke-width='2' fill='none'/%3E%3C/svg%3E")` }}></div>

      <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-2 gap-16 items-center relative z-20">
        <div className="space-y-12 hidden lg:block animate-in slide-in-from-right duration-1000">
          <div className="flex items-center gap-8">
            <Logo className="w-28 h-28" />
            <div>
              <h1 className="text-8xl font-black italic tracking-tighter text-white">GoNet <span className="text-blue-500">PRO</span></h1>
              <div className="flex items-center gap-3 mt-2">
                 <div className="h-0.5 w-12 bg-[#009736]"></div>
                 <p className="text-[#009736] font-black uppercase tracking-[0.6em] text-[11px]">أصالة التراث.. قوة التكنولوجيا</p>
              </div>
            </div>
          </div>

          <div className="space-y-10">
            <div className="space-y-4">
               <div className="flex items-center gap-4 text-[#e9d8a6]">
                 <Map size={40} className="animate-pulse" />
                 <h2 className="text-6xl font-black leading-tight text-white">الكوفية.. <br/> رمز العزة والحرية</h2>
               </div>
               <p className="text-slate-400 font-bold max-w-lg text-lg leading-relaxed">
                 استمتع بمشاهدة صامدة ومحتوى متميز، في تطبيق يفتخر بهويته الفلسطينية ويقدم لك أفضل تجربة بث.
               </p>
            </div>
            
            <div className="grid grid-cols-2 gap-6">
              <div className="glass-v3 p-8 rounded-[40px] group hover:border-[#EE2D23]/40 transition-all duration-500">
                <Flame className="text-[#EE2D23] mb-5 group-hover:scale-125 transition-transform duration-500" />
                <h3 className="font-black text-xl mb-2">ثبات لا يلين</h3>
                <p className="text-sm text-slate-500 leading-relaxed font-bold">بث مستقر، تماماً كصمود أهلنا في القدس وغزة.</p>
              </div>
              <div className="glass-v3 p-8 rounded-[40px] group hover:border-[#009736]/40 transition-all duration-500">
                <TreePine className="text-[#009736] mb-5 animate-bounce" />
                <h3 className="font-black text-xl mb-2">جذور ممتدة</h3>
                <p className="text-sm text-slate-500 leading-relaxed font-bold">محتوى غني يربطك بالعالم مع الحفاظ على الأصالة.</p>
              </div>
            </div>
          </div>
        </div>

        <div className="w-full max-w-md mx-auto">
          <div className="glass-v3 rounded-[60px] p-12 md:p-16 shadow-[0_50px_100px_-20px_rgba(0,0,0,0.8)] relative overflow-hidden group">
            <div className="absolute top-0 inset-x-0 h-2 flex opacity-60">
               {[...Array(40)].map((_, i) => (
                 <div key={i} className={`flex-1 ${i % 3 === 0 ? 'bg-[#EE2D23]' : i % 3 === 1 ? 'bg-[#009736]' : 'bg-white'}`}></div>
               ))}
            </div>

            <div className="text-center mb-16">
               <div className="flex justify-center mb-6">
                  <Logo className="w-20 h-20" />
               </div>
               <h3 className="text-4xl font-black mb-4">كود التفعيل</h3>
               <p className="text-slate-500 font-bold italic">صامدون.. مستمرون</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-10">
              {error && (
                <div className="flex items-center gap-4 p-6 bg-[#EE2D23]/10 border border-[#EE2D23]/30 rounded-[30px] text-[#EE2D23] text-sm animate-in shake">
                  <AlertCircle size={24} className="shrink-0" />
                  <p className="font-black">{error}</p>
                </div>
              )}

              <div className="space-y-6">
                <div className="relative group/input">
                  <input 
                    type="text" 
                    value={formData.activationCode}
                    onChange={(e) => setFormData({ activationCode: e.target.value })}
                    className="w-full bg-black/40 border-2 border-white/5 rounded-[35px] py-8 px-6 focus:border-blue-500 text-center font-mono text-3xl font-black text-blue-500 outline-none transition-all shadow-[inset_0_4px_20px_rgba(0,0,0,0.5)] tracking-[0.1em]"
                    placeholder=""
                    required
                  />
                  <div className="absolute -bottom-2 inset-x-12 h-1 bg-gradient-to-r from-transparent via-blue-500 to-transparent opacity-0 group-focus-within/input:opacity-100 transition-opacity"></div>
                </div>
              </div>

              <button type="submit" disabled={loading} className="w-full bg-blue-600 hover:bg-blue-500 text-white font-black py-8 rounded-[35px] shadow-[0_20px_40px_-10px_rgba(37,99,235,0.4)] flex items-center justify-center gap-5 disabled:opacity-50 transition-all active:scale-95 group relative overflow-hidden">
                <div className="absolute inset-0 bg-white/10 translate-x-full group-hover:translate-x-0 transition-transform duration-700"></div>
                {loading ? <div className="w-10 h-10 border-4 border-white/30 border-t-white rounded-full animate-spin"></div> : <>
                  <span className="text-2xl relative z-10">دخول آمن</span>
                  <ArrowRight className="w-8 h-8 relative z-10 group-hover:translate-x-[-12px] transition-transform" />
                </>}
              </button>
            </form>

            <div className="mt-12 text-center space-y-6">
                <div className="bg-white/5 py-4 px-6 rounded-2xl border border-white/10 flex flex-col items-center gap-2">
                   <div className="flex items-center gap-3 text-blue-400">
                      <PhoneCall size={18} />
                      <span className="text-[13px] font-black">للدعم الفني وطلب الاشتراك</span>
                   </div>
                   <p className="text-xl font-black font-mono tracking-widest text-white">0566000140</p>
                </div>

                <div className="space-y-4">
                  <p className="text-[10px] text-slate-600 font-black uppercase tracking-[0.6em]">PALESTINE EDITION v11.0</p>
                  <div className="flex justify-center items-center gap-4 opacity-30">
                    <div className="w-2 h-2 rounded-full bg-white"></div>
                    <div className="w-2 h-2 rounded-full bg-[#009736]"></div>
                    <div className="w-2 h-2 rounded-full bg-[#EE2D23]"></div>
                  </div>
                </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
