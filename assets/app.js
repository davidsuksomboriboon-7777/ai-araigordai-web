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

  // 4. Video Player Modal (Promote Intro Video, Basic AI Course Video, Student Showcase, Studio Showcase)
  const playVideoBtn = document.getElementById('play-intro-video-btn');
  const heroVideoBox = document.getElementById('hero-video-trigger-box');
  const basicCourseVideoBox = document.getElementById('play-basic-course-video-box');
  const studentVideoBox = document.getElementById('play-student-video-box');
  const studioVdoBox = document.getElementById('play-studio-vdo-box');
  const studioImageBox = document.getElementById('play-studio-image-box');
  const videoModal = document.getElementById('video-modal');
  const closeModalBtn = document.getElementById('close-video-modal-btn');
  const videoContainer = document.getElementById('video-container-target');
  const modalTitle = document.getElementById('modal-video-title');
  const modalSubtitle = document.getElementById('modal-video-subtitle');

  const openAndPlayVideo = (src = 'assets/videos/company-profile.mp4', title = 'คลิปแนะนำ AI อะไรก็ได้', subtitle = 'AI อะไรก็ได้ • Official Video') => {
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
        class="w-full h-full max-h-[75vh] rounded-2xl object-contain bg-slate-950 shadow-2xl focus:outline-none">
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
      openAndPlayVideo('assets/videos/company-profile.mp4', 'คลิปแนะนำ AI อะไรก็ได้', 'AI อะไรก็ได้ • Official Video');
    });
  }

  if (heroVideoBox) {
    heroVideoBox.addEventListener('click', () => {
      openAndPlayVideo('assets/videos/company-profile.mp4', 'คลิปแนะนำ AI อะไรก็ได้', 'AI อะไรก็ได้ • Official Video');
    });
  }

  if (basicCourseVideoBox) {
    basicCourseVideoBox.addEventListener('click', () => {
      openAndPlayVideo('assets/videos/basic-ai-promo-master.mp4', 'วิดีโอโปรโมทคอร์ส Basic AI Master', 'ตัวอย่างเนื้อหาและการใช้ AI ผลิตสื่อจริง • AI อะไรก็ได้');
    });
  }

  if (studentVideoBox) {
    studentVideoBox.addEventListener('click', () => {
      openAndPlayVideo('assets/videos/student-work-namprik.mp4', 'ตัวอย่างโปรโมทสินค้า น้ำพริกปลาย่าง (ผลงานน้องชมพู่)', 'ผลงานนักเรียนจริงจากการเรียนคอร์ส Basic AI (990.-) • AI อะไรก็ได้');
    });
  }

  if (studioVdoBox) {
    studioVdoBox.addEventListener('click', () => {
      openAndPlayVideo('assets/videos/studio-sample-vdo.mp4', 'ตัวอย่างผลงาน VDO AI', 'ผลงานการผลิตคลิปวิดีโอด้วย AI โดย AI อะไรก็ได้ Studio');
    });
  }

  if (studioImageBox) {
    studioImageBox.addEventListener('click', () => {
      openAndPlayVideo('assets/videos/studio-sample-image.mp4', 'ตัวอย่างผลงาน รูปภาพ AI', 'ผลงานการสร้างสรรค์รูปภาพสินค้าและแบรนด์ด้วย AI โดย AI อะไรก็ได้ Studio');
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

  // 4.1 Basic AI Combined Auto-Slider (3s Auto-Slide: Video Promo & Poster)
  const basicMediaSlider = document.getElementById('basic-media-slider');
  const slideBasicVideo = document.getElementById('slide-basic-video');
  const slideBasicPoster = document.getElementById('slide-basic-poster');
  const dotBasic0 = document.getElementById('basic-dot-0');
  const dotBasic1 = document.getElementById('basic-dot-1');

  if (basicMediaSlider && slideBasicVideo && slideBasicPoster) {
    let currentSlide = 0; // 0: Video, 1: Poster
    let slideTimer = null;

    const setSlide = (index) => {
      currentSlide = index;
      if (currentSlide === 0) {
        slideBasicVideo.classList.remove('opacity-0', 'pointer-events-none', 'z-0');
        slideBasicVideo.classList.add('opacity-100', 'z-10');
        slideBasicPoster.classList.remove('opacity-100', 'z-10');
        slideBasicPoster.classList.add('opacity-0', 'pointer-events-none', 'z-0');

        if (dotBasic0) dotBasic0.className = 'w-5 h-2 rounded-full bg-cyan-400 transition-all duration-300';
        if (dotBasic1) dotBasic1.className = 'w-2 h-2 rounded-full bg-white/40 hover:bg-white/70 transition-all duration-300';
      } else {
        slideBasicPoster.classList.remove('opacity-0', 'pointer-events-none', 'z-0');
        slideBasicPoster.classList.add('opacity-100', 'z-10');
        slideBasicVideo.classList.remove('opacity-100', 'z-10');
        slideBasicVideo.classList.add('opacity-0', 'pointer-events-none', 'z-0');

        if (dotBasic0) dotBasic0.className = 'w-2 h-2 rounded-full bg-white/40 hover:bg-white/70 transition-all duration-300';
        if (dotBasic1) dotBasic1.className = 'w-5 h-2 rounded-full bg-cyan-400 transition-all duration-300';
      }
    };

    const startAutoSlide = () => {
      stopAutoSlide();
      slideTimer = setInterval(() => {
        setSlide(currentSlide === 0 ? 1 : 0);
      }, 3000);
    };

    const stopAutoSlide = () => {
      if (slideTimer) {
        clearInterval(slideTimer);
        slideTimer = null;
      }
    };

    setSlide(0);
    startAutoSlide();

    basicMediaSlider.addEventListener('mouseenter', stopAutoSlide);
    basicMediaSlider.addEventListener('mouseleave', startAutoSlide);

    if (dotBasic0) {
      dotBasic0.addEventListener('click', (e) => {
        e.stopPropagation();
        setSlide(0);
        startAutoSlide();
      });
    }
    if (dotBasic1) {
      dotBasic1.addEventListener('click', (e) => {
        e.stopPropagation();
        setSlide(1);
        startAutoSlide();
      });
    }

    slideBasicVideo.addEventListener('click', () => {
      openAndPlayVideo('assets/videos/basic-ai-promo-master.mp4', 'วิดีโอโปรโมทคอร์ส Basic AI Master', 'ตัวอย่างเนื้อหาและการใช้ AI ผลิตสื่อจริง • AI อะไรก็ได้');
    });
  }

  // 5. Dynamic Poster Lightbox Modal (Supports multiple posters)
  const posterModal = document.getElementById('poster-modal');
  const closePosterBtn = document.getElementById('close-poster-btn');
  const modalPosterImg = document.getElementById('modal-poster-img');
  const modalPosterTitle = document.getElementById('modal-poster-title');
  const modalPosterSubtitle = document.getElementById('modal-poster-subtitle');
  const modalPosterBadge = document.getElementById('modal-poster-badge');

  const openPosterModal = (src, title, subtitle, badge) => {
    if (!posterModal) return;
    if (modalPosterImg && src) modalPosterImg.src = src;
    if (modalPosterTitle && title) modalPosterTitle.textContent = title;
    if (modalPosterSubtitle && subtitle) modalPosterSubtitle.textContent = subtitle;
    if (modalPosterBadge && badge) modalPosterBadge.textContent = badge;
    posterModal.classList.remove('hidden');
  };

  document.querySelectorAll('.poster-trigger-card').forEach(card => {
    card.addEventListener('click', () => {
      const src = card.getAttribute('data-poster-src') || 'assets/images/poster-basic-ai.png';
      const title = card.getAttribute('data-poster-title') || 'โปสเตอร์ AI อะไรก็ได้';
      const sub = card.getAttribute('data-poster-sub') || 'ขนาดความละเอียดสูง';
      const badge = card.getAttribute('data-poster-badge') || (
        src.includes('business') ? 'ราคาพิเศษ 1,290.- (จาก 2,990.-)' :
        src.includes('basic') ? 'ราคาโปรโมชัน 990.- (จาก 1,990.-)' :
        src.includes('student') ? 'ผลงานจริงจากนักเรียน' :
        'AI Media Production'
      );
      openPosterModal(src, title, sub, badge);
    });
  });

  if (closePosterBtn && posterModal) {
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
          if (confirm(`ส่งข้อมูลของคุณ ${fullName} (${courseTrack}) ไปยังอีเมลทีมงาน Ai.araigordai@gmail.com เรียบร้อยแล้ว!\n\nต้องการเปิด Line OA เพื่อรับคำปรึกษาและพูดคุยรายละเอียดกับคุณดาวิดทันทีหรือไม่?`)) {
            window.open(lineRedirectUrl, '_blank');
          }
        }, 500);

        regForm.reset();
      }, 900);
    });
  }

  // Helper function to dynamically select course track and scroll to form
  window.selectCourseTrack = function(trackValue) {
    const radio = document.querySelector(`input[name="course_track"][value="${trackValue}"]`);
    if (radio) {
      radio.checked = true;
      // Trigger visual change if needed
      radio.dispatchEvent(new Event('change'));
    }
    const regSection = document.getElementById('registration');
    if (regSection) {
      regSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

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
