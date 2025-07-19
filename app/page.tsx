"use client"

import { useState, useEffect, useRef } from "react"
import { MapPin, Calendar, Users, Heart, Star, ArrowRight, ExternalLink, Volume2, VolumeX } from "lucide-react"

export default function Page() {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  })
  const audioRef = useRef<HTMLAudioElement>(null)
  const [isMuted, setIsMuted] = useState(false) // يبدأ غير مكتوم (محاولة للتشغيل التلقائي)
  const [isPlaying, setIsPlaying] = useState(false) // يتتبع ما إذا كان الصوت قيد التشغيل فعليًا

  // Countdown timer - Updated to 2025
  useEffect(() => {
    const targetDate = new Date("2025-08-19T18:00:00").getTime()
    const timer = setInterval(() => {
      const now = new Date().getTime()
      const difference = targetDate - now
      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((difference % (1000 * 60)) / 1000),
        })
      } else {
        clearInterval(timer)
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 })
      }
    }, 1000)
    return () => clearInterval(timer)
  }, [])

  // محاولة تشغيل الصوت تلقائيًا عند تحميل المكون
  useEffect(() => {
    const audio = audioRef.current
    if (audio) {
      audio.volume = 0.5 // تعيين مستوى الصوت الافتراضي
      audio.muted = isMuted // تعيين حالة الكتم الأولية
      audio
        .play()
        .then(() => {
          setIsPlaying(true)
          console.log("Audio autoplayed successfully.")
        })
        .catch((error) => {
          console.error("Autoplay was prevented:", error)
          setIsPlaying(false)
          // إذا تم حظر التشغيل التلقائي، قم بكتم الصوت لتمكين التشغيل اليدوي
          setIsMuted(true)
          audio.muted = true
        })

      const handlePlay = () => setIsPlaying(true)
      const handlePause = () => setIsPlaying(false)
      const handleVolumeChange = () => setIsMuted(audio.muted)

      audio.addEventListener("play", handlePlay)
      audio.addEventListener("pause", handlePause)
      audio.addEventListener("volumechange", handleVolumeChange)

      return () => {
        audio.removeEventListener("play", handlePlay)
        audio.removeEventListener("pause", handlePause)
        audio.removeEventListener("volumechange", handleVolumeChange)
      }
    }
  }, []) // يتم التشغيل مرة واحدة عند تحميل المكون

  // وظيفة للتعامل مع التشغيل/الإيقاف المؤقت وكتم/إلغاء كتم الصوت
  const toggleAudio = async () => {
    if (audioRef.current) {
      const audio = audioRef.current
      if (audio.muted) {
        // إذا كان مكتومًا حاليًا، قم بإلغاء كتمه وحاول التشغيل
        audio.muted = false
        setIsMuted(false)
        try {
          await audio.play()
          setIsPlaying(true)
          console.log("Audio unmuted and playing.")
        } catch (error) {
          console.error("Error playing audio after unmute:", error)
          setIsPlaying(false)
        }
      } else {
        // إذا كان غير مكتوم حاليًا، قم بكتمه وإيقافه مؤقتًا
        audio.muted = true
        audio.pause()
        setIsMuted(true)
        setIsPlaying(false)
        console.log("Audio muted and paused.")
      }
    }
  }

  const addToCalendar = () => {
    const event = {
      text: "احتفال الحناء",
      dates: "20250819T180000/20250819T230000",
      details: "احتفال حناء خاص - غير مناسب للأطفال دون 12 عامًا",
      location: "رفح، قطاع غزة",
    }
    const googleCalendarUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(event.text)}&dates=${event.dates}&details=${encodeURIComponent(event.details)}&location=${encodeURIComponent(event.location)}`
    window.open(googleCalendarUrl, "_blank")
  }

  const openGoogleForm = () => {
    // Replace this URL with your actual Google Form URL
    const googleFormUrl =
      "https://docs.google.com/forms/d/e/1FAIpQLSc7xIFPaFRXanYuB9uveevFV9bve70Qmg0W8dWpZSCXYCxSXQ/viewform?usp=sf_link"
    window.open(googleFormUrl, "_blank")
  }

  return (
    <div className="min-h-screen bg-stone-50">
      {/* Audio Player for Background Music */}
      <audio ref={audioRef} autoPlay loop className="hidden">
        {" "}
        {/* تم إزالة muted={isMuted} للسماح بالتشغيل التلقائي غير المكتوم */}
        <source src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Audio%202025-07-19%20at%2022.37.23_58e36fdd-KuR0x8E1dXMLFjXe6oGAdScDAaF2jw.mp3" type="audio/mpeg" /> {/* تم تحديث المسار */}
        متصفحك لا يدعم عنصر الصوت.
      </audio>

      {/* Mute/Unmute/Play/Pause Button */}
      <button
        onClick={toggleAudio}
        className="fixed bottom-4 right-4 z-50 p-3 rounded-full bg-stone-800 text-white shadow-lg hover:bg-stone-700 transition-colors"
        aria-label={isMuted ? "تشغيل الصوت" : "كتم الصوت"}
      >
        {isMuted ? <VolumeX className="w-6 h-6" /> : <Volume2 className="w-6 h-6" />}
      </button>

      {/* Navigation */}
      <nav className="bg-white/95 backdrop-blur-sm border-b border-stone-200 sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <div className="text-2xl font-serif text-stone-800">Our Special Day</div>
            <div className="hidden md:flex space-x-8 text-stone-600">
              <a href="#details" className="hover:text-stone-800 transition-colors">
                التفاصيل
              </a>
              <a href="#location" className="hover:text-stone-800 transition-colors">
                الموقع
              </a>
              <a href="#rsvp" className="hover:text-stone-800 transition-colors">
                تأكيد الحضور
              </a>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center">
        {/* Background Image with Better Visibility */}
        <div className="absolute inset-0 bg-[url('/images/hero-background.jpg')] bg-cover bg-center"></div>
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/20 to-black/40"></div>
        <div className="relative z-10 text-center max-w-4xl mx-auto px-6">
          <div className="mb-8">
            <h1 className="text-5xl md:text-7xl font-great-vibes text-white mb-4 leading-tight drop-shadow-lg">
              A Timeless Union
            </h1>
            <p className="text-xl md:text-2xl font-great-vibes text-white/90 font-light mb-8 max-w-2xl mx-auto drop-shadow-md">
              A special celebration of beautiful traditions in an atmosphere of joy and happiness
            </p>
          </div>

          {/* Countdown Timer */}
          <div className="grid grid-cols-4 gap-4 max-w-md mx-auto mb-12">
            <div className="bg-white/95 backdrop-blur-sm rounded-lg p-4 border border-stone-200 shadow-lg">
              <div className="text-3xl font-bold text-stone-800">{timeLeft.days}</div>
              <div className="text-sm text-stone-600 font-light">أيام</div>
            </div>
            <div className="bg-white/95 backdrop-blur-sm rounded-lg p-4 border border-stone-200 shadow-lg">
              <div className="text-3xl font-bold text-stone-800">{timeLeft.hours}</div>
              <div className="text-sm text-stone-600 font-light">ساعات</div>
            </div>
            <div className="bg-white/95 backdrop-blur-sm rounded-lg p-4 border border-stone-200 shadow-lg">
              <div className="text-3xl font-bold text-stone-800">{timeLeft.minutes}</div>
              <div className="text-sm text-stone-600 font-light">دقائق</div>
            </div>
            <div className="bg-white/95 backdrop-blur-sm rounded-lg p-4 border border-stone-200 shadow-lg">
              <div className="text-3xl font-bold text-stone-800">{timeLeft.seconds}</div>
              <div className="text-sm text-stone-600 font-light">ثواني</div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={addToCalendar}
              className="bg-white/95 backdrop-blur-sm text-stone-800 px-8 py-4 rounded-full font-medium hover:bg-white transition-all duration-300 flex items-center justify-center group shadow-lg border border-stone-200"
            >
              <Calendar className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform" />
              حفظ في التقويم
            </button>
            <a
              href="#rsvp"
              className="border-2 border-white/90 text-white px-8 py-4 rounded-full font-medium hover:bg-white/90 hover:text-stone-800 transition-all duration-300 flex items-center justify-center group backdrop-blur-sm"
            >
              أكد حضورك الآن
              <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
            </a>
          </div>
        </div>
      </section>

      {/* Event Details */}
      <section id="details" className="py-20 bg-white scroll-mt-24">
        <div className="container mx-auto px-6">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-serif text-stone-800 mb-6">تفاصيل الحفل</h2>
              <div className="w-24 h-px bg-amber-400 mx-auto"></div>
            </div>
            <div className="grid md:grid-cols-2 gap-16 items-center">
              <div className="space-y-12">
                <div className="group">
                  <div className="flex items-start mb-4">
                    <div className="w-12 h-12 bg-stone-100 rounded-full flex items-center justify-center mr-4 group-hover:bg-amber-100 transition-colors">
                      <Calendar className="w-6 h-6 text-stone-600 group-hover:text-amber-600" />
                    </div>
                    <div>
                      <h3 className="text-2xl font-serif text-stone-800 mb-2">التاريخ والوقت</h3>
                      <p className="text-xl text-stone-600 mb-1">الاثنين، 19 أغسطس 2025</p>
                      <p className="text-lg text-stone-500">6:00 مساءً</p>
                    </div>
                  </div>
                </div>
                <div className="group scroll-mt-24" id="location">
                  <div className="flex items-start mb-4">
                    <div className="w-12 h-12 bg-stone-100 rounded-full flex items-center justify-center mr-4 group-hover:bg-amber-100 transition-colors">
                      <MapPin className="w-6 h-6 text-stone-600 group-hover:text-amber-600" />
                    </div>
                    <div>
                      <h3 className="text-2xl font-serif text-stone-800 mb-2">الموقع</h3>
                      <p className="text-lg text-stone-600 mb-4">رفح، قطاع غزة</p>
                      <a
                        href="https://maps.app.goo.gl/ZFsKDswqPqCDFhDG8"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center text-stone-800 hover:text-amber-600 transition-colors font-medium"
                      >
                        عرض على الخريطة
                        <ExternalLink className="w-4 h-4 ml-2" />
                      </a>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl p-8 border border-amber-100">
                <div className="flex items-center mb-6">
                  <Star className="w-8 h-8 text-amber-600 mr-3" />
                  <h3 className="text-2xl font-serif text-stone-800">ملاحظة هامة</h3>
                </div>
                <div className="bg-white/80 rounded-xl p-6 border border-amber-200">
                  <p className="text-lg text-stone-700 font-medium text-center mb-2">
                    هذا الاحتفال غير مناسب للأطفال دون 12 عامًا
                  </p>
                  <p className="text-stone-600 text-center">نأمل تفهمكم ونتطلع لقضاء وقت رائع معكم</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* RSVP Section */}
      <section id="rsvp" className="py-20 bg-stone-50 scroll-mt-24">
        <div className="container mx-auto px-6">
          <div className="max-w-2xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-4xl md:text-5xl font-serif text-stone-800 mb-6">تأكيد الحضور</h2>
              <div className="w-24 h-px bg-amber-400 mx-auto mb-6"></div>
              <p className="text-lg text-stone-600">يسعدنا حضوركم لهذا الاحتفال الخاص</p>
            </div>
            <div className="bg-white rounded-2xl p-8 shadow-sm border border-stone-200 text-center">
              <div className="mb-8">
                <div className="w-20 h-20 bg-gradient-to-br from-amber-100 to-orange-100 rounded-full flex items-center justify-center mx-auto mb-6 border border-amber-200">
                  <Users className="w-10 h-10 text-amber-600" />
                </div>
                <h3 className="text-2xl font-serif text-stone-800 mb-4">تأكيد حضورك</h3>
                <p className="text-stone-600 mb-8">
                  يرجى ملء النموذج لإعلامنا بحضوركم. سنحتاج إلى اسمكم ورقم هاتفكم وعدد الضيوف التقريبي.
                </p>
              </div>
              <button
                onClick={openGoogleForm}
                className="bg-stone-800 text-white px-12 py-4 rounded-full font-medium text-lg hover:bg-stone-700 transition-all duration-300 transform hover:scale-[1.02] shadow-sm inline-flex items-center"
              >
                <ExternalLink className="w-5 h-5 mr-2" />
                أكمل نموذج تأكيد الحضور
              </button>
              <p className="text-sm text-stone-500 mt-4">سيتم توجيهك إلى نموذج جوجل الآمن الخاص بنا</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-stone-800 text-white py-12">
        <div className="container mx-auto px-6 text-center">
          <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <Heart className="w-8 h-8" />
          </div>
          <h3 className="text-2xl font-serif mb-2">Our Special Day</h3>
          <p className="text-stone-300 mb-1">19 أغسطس 2025</p>
          <p className="text-stone-400">6:00 مساءً • رفح، قطاع غزة</p>
        </div>
      </footer>
    </div>
  )
}
