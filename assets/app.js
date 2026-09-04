/**
 * AI อะไรก็ได้ (AI Arai Gor Dai) - Interactive Engine 2.0
 * Video Modal, Poster Lightbox, Form Validation & Google Mail Endpoint
 */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Lucide Icons
  if (typeof lucide !== 'undefined') {
    lucide.createIcons();
  }

  // 2. AOS Scroll Reveal
  if (typeof AOS !== 'undefined') {
    AOS.init({
      duration: 800,
      easing: 'ease-out-cubic',
      once: false,
      offset: 40
    });
  }

  // 3. Mobile Navigation Menu Toggle
  const mobileMenuBtn = document.getElementById('mobile-menu-btn');
  const mobileMenu = document.getElementById('mobile-menu');

  if (mobileMenuBtn && mobileMenu) {
    mobileMenuBtn.addEventListener('click', () => {
      const isHidden = mobileMenu.classList.toggle('hidden');
      const icon = mobileMenuBtn.querySelector('i');
      if (icon) {
        icon.setAttribute('data-lucide', isHidden ? 'menu' : 'x');
        lucide.createIcons();
      }
    });

    mobileMenu.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        mobileMenu.classList.add('hidden');
        const icon = mobileMenuBtn.querySelector('i');
        if (icon) {
          icon.setAttribute('data-lucide', 'menu');
          lucide.createIcons();
        }
      });
    });
  }

  // 4. Video Player Modal (Promote Intro Video & Basic AI Course Video)
  const playVideoBtn = document.getElementById('play-intro-video-btn');
  const heroVideoBox = document.getElementById('hero-video-trigger-box');
  const basicCourseVideoBox = document.getElementById('play-basic-course-video-box');
  const videoModal = document.getElementById('video-modal');
  const closeModalBtn = document.getElementById('close-video-modal-btn');
  const videoContainer = document.getElementById('video-container-target');
  const modalTitle = document.getElementById('modal-video-title');
  const modalSubtitle = document.getElementById('modal-video-subtitle');

  const openAndPlayVideo = (src = 'assets/videos/promote-intro.mp4', title = 'แนะนำคอร์ส Basic AI โดย AI อะไรก็ได้', subtitle = 'AI อะไรก็ได้ • Official Video') => {
    if (!videoModal || !videoContainer) return;
    if (modalTitle) modalTitle.textContent = title;
    if (modalSubtitle) modalSubtitle.textContent = subtitle;

    videoModal.classList.remove('hidden');
    videoContainer.innerHTML = `
      <video 
        id="active-intro-video-player"
        src="${src}" 
        controls 
        autoplay 
        playsinline 
        class="w-full h-full rounded-2xl object-contain bg-slate-950 shadow-2xl focus:outline-none">
        เบราว์เซอร์ของคุณไม่รองรับการเล่นวิดีโอ HTML5
      </video>
    `;
    const videoEl = document.getElementById('active-intro-video-player');
    if (videoEl) {
      videoEl.play().catch(() => console.log('Autoplay waiting for interaction'));
    }
  };

  const closeAndStopVideo = () => {
    if (!videoModal || !videoContainer) return;
    videoModal.classList.add('hidden');
    const videoEl = document.getElementById('active-intro-video-player');
    if (videoEl) {
      videoEl.pause();
      videoEl.currentTime = 0;
    }
    videoContainer.innerHTML = '';
  };

  if (playVideoBtn) {
    playVideoBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      openAndPlayVideo('assets/videos/promote-intro.mp4', 'แนะนำคอร์ส Basic AI โดย AI อะไรก็ได้', 'AI อะไรก็ได้ • Official Video');
    });
  }

  if (heroVideoBox) {
    heroVideoBox.addEventListener('click', () => {
      openAndPlayVideo('assets/videos/promote-intro.mp4', 'แนะนำคอร์ส Basic AI โดย AI อะไรก็ได้', 'AI อะไรก็ได้ • Official Video');
    });
  }

  if (basicCourseVideoBox) {
    basicCourseVideoBox.addEventListener('click', () => {
      openAndPlayVideo('assets/videos/basic-ai-intro.mp4', 'แนะนำ Basic AI ของ AI อะไรก็ได้', 'รายละเอียดและตัวอย่างเนื้อหาคอร์ส Basic AI (990.-)');
    });
  }

  if (closeModalBtn) {
    closeModalBtn.addEventListener('click', closeAndStopVideo);
  }

  if (videoModal) {
    videoModal.addEventListener('click', (e) => {
      if (e.target === videoModal) closeAndStopVideo();
    });
  }

  // 5. Poster Lightbox Modal
  const posterModal = document.getElementById('poster-modal');
  const openPosterBtn = document.getElementById('open-poster-btn');
  const closePosterBtn = document.getElementById('close-poster-btn');

  if (openPosterBtn && posterModal && closePosterBtn) {
    openPosterBtn.addEventListener('click', () => {
      posterModal.classList.remove('hidden');
    });

    closePosterBtn.addEventListener('click', () => {
      posterModal.classList.add('hidden');
    });

    posterModal.addEventListener('click', (e) => {
      if (e.target === posterModal) posterModal.classList.add('hidden');
    });
  }

  // Support ESC Key for modals
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeAndStopVideo();
      if (posterModal) posterModal.classList.add('hidden');
    }
  });

  // 6. Interactive Assessment & Registration Form Submission
  const regForm = document.getElementById('ai-registration-form');
  const formStatus = document.getElementById('form-status-message');

  if (regForm) {
    regForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const fullName = document.getElementById('form-fullname').value.trim();
      const occupation = document.getElementById('form-occupation').value.trim();
      const skillLevel = document.querySelector('input[name="skill_level"]:checked')?.value || 'เริ่มต้น';
      const aiExperience = document.getElementById('form-experience').value.trim();
      const learningGoal = document.getElementById('form-goal').value.trim();
      const phone = document.getElementById('form-phone').value.trim();
      const lineId = document.getElementById('form-lineid').value.trim();
      const courseTrack = document.querySelector('input[name="course_track"]:checked')?.value || 'Basic AI (990.-)';

      if (!fullName || !phone) {
        alert('กรุณากรอกชื่อ-นามสกุล และเบอร์โทรศัพท์สำหรับติดต่อกลับครับ');
        return;
      }

      const submitBtn = regForm.querySelector('button[type="submit"]');
      const originalText = submitBtn.innerHTML;
      submitBtn.disabled = true;
      submitBtn.innerHTML = `
        <span class="inline-block animate-spin mr-2">⏳</span>
        <span>กำลังส่งข้อมูลประเมินทักษะ...</span>
      `;

      // Compose details for log & confirmation
      console.log(`[AI Registration] ${fullName} | ${courseTrack} | ${phone} | ${lineId} -> Ai.araigordai@gmail.com`);

      // Dispatch form data to Ai.araigordai@gmail.com via FormSubmit endpoint
      const payload = {
        _subject: `[AI อะไรก็ได้] ผู้ลงทะเบียนใหม่: ${fullName} (${courseTrack})`,
        _template: "table",
        "ชื่อ-นามสกุล": fullName,
        "อาชีพ/ธุรกิจปัจจุบัน": occupation || "-",
        "คอร์สที่เลือกเรียน": courseTrack,
        "ระดับทักษะ": skillLevel,
        "ประสบการณ์ AI": aiExperience || "-",
        "เป้าหมายการเรียน": learningGoal || "-",
        "เบอร์โทรศัพท์": phone,
        "LINE ID": lineId || "-",
        "วันเวลาที่ลงทะเบียน": new Date().toLocaleString('th-TH', { timeZone: 'Asia/Bangkok' })
      };

      fetch('https://formsubmit.co/ajax/Ai.araigordai@gmail.com', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(payload)
      }).catch(err => console.log('Form submission response:', err));

      setTimeout(() => {
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalText;

        if (formStatus) {
          formStatus.classList.remove('hidden');
          formStatus.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }

        const lineRedirectUrl = `https://lin.ee/xGJFmH9`;
        setTimeout(() => {
          if (confirm(`ส่งข้อมูลลงทะเบียนของคุณ ${fullName} ไปยังอีเมล Ai.araigordai@gmail.com เรียบร้อยแล้ว!\n\nต้องการเปิด Line OA เพื่อรับคำปรึกษาและคอนเฟิร์มสิทธิ์ราคาพิเศษ 990.- ทันทีหรือไม่?`)) {
            window.open(lineRedirectUrl, '_blank');
          }
        }, 500);

        regForm.reset();
      }, 900);
    });
  }

  // 7. Smooth internal anchor scrolling
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;
      const targetEl = document.querySelector(targetId);
      if (targetEl) {
        e.preventDefault();
        targetEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  // 8. Remotion Pop-up Character Assistant (1-Time Trigger & Scroll-Up Exit)
  const assistantWidget = document.getElementById('remotion-assistant-widget');
  const speechBubble = document.getElementById('remotion-speech-bubble');
  const closeAssistantBtn = document.getElementById('close-assistant-btn');
  const closingSection = document.getElementById('closing-cta-segment') || document.querySelector('footer');

  if (assistantWidget && closingSection) {
    let assistantState = 'idle'; // 'idle' -> 'shown' -> 'dismissed'

    const dismissAssistant = () => {
      if (assistantState === 'dismissed') return;
      assistantState = 'dismissed';
      assistantWidget.classList.remove('remotion-avatar-enter');
      assistantWidget.classList.add('remotion-avatar-exit');
      setTimeout(() => {
        assistantWidget.classList.add('hidden');
      }, 700);
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        // First time entering the last segment -> Show up
        if (entry.isIntersecting && assistantState === 'idle') {
          assistantState = 'shown';
          assistantWidget.classList.remove('opacity-0', 'translate-y-28');
          assistantWidget.classList.add('remotion-avatar-enter');
          if (speechBubble) {
            speechBubble.classList.add('remotion-bubble-enter');
          }
        }
        // Scrolling back up away from last segment -> Exit and never show again (1-time only)
        else if (!entry.isIntersecting && assistantState === 'shown') {
          dismissAssistant();
          observer.unobserve(closingSection);
        }
      });
    }, {
      threshold: 0.12
    });

    observer.observe(closingSection);

    if (closeAssistantBtn) {
      closeAssistantBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        dismissAssistant();
        observer.unobserve(closingSection);
      });
    }

    // Clicking avatar also triggers toggle or dismiss
    assistantWidget.querySelector('img')?.addEventListener('click', () => {
      if (speechBubble) {
        speechBubble.classList.toggle('hidden');
      }
    });
  }
});
