(function () {
  "use strict";

  const STORAGE_KEY = "vault_net_v2";
  const GLYPHS = "01ABCDEF#$%*+/=<>█▓▒░";

  const SEED_MEMBERS = [
    {
      id: "layan",
      nameAr: "ليان العنزي",
      nameEn: "Layan Al-Anazi",
      code: "7A3F",
      role: "member",
      phone: "+966504938904",
      cityAr: "تبوك",
      cityEn: "Tabuk",
    },
    {
      id: "abdullah",
      nameAr: "عبدالله البلوي",
      nameEn: "Abdullah Al-Balawi",
      code: "B2E9",
      role: "member",
      phone: "+966530692431",
      cityAr: "حفر الباطن",
      cityEn: "Hafr Al-Batin",
    },
    {
      id: "tariq",
      nameAr: "طارق",
      nameEn: "Tariq",
      code: "9K1M",
      role: "admin",
      phone: "",
      cityAr: "—",
      cityEn: "—",
    },
    {
      id: "omar",
      nameAr: "عمر الحربي",
      nameEn: "Omar Al-Harbi",
      code: "C4D8",
      role: "member",
      phone: "+966503929942",
      cityAr: "القصيم",
      cityEn: "Al-Qassim",
    },
    {
      id: "hassan",
      nameAr: "حسن الشهري",
      nameEn: "Hassan Al-Shahri",
      code: "F6A2",
      role: "member",
      phone: "+966562106882",
      cityAr: "جدة",
      cityEn: "Jeddah",
    },
    {
      id: "ahmed",
      nameAr: "أحمد",
      nameEn: "Ahmed",
      code: "A8H2",
      role: "member",
      phone: "+96898203409",
      cityAr: "عُمان",
      cityEn: "Oman",
    },
  ];

  const STRINGS = {
    ar: {
      brandSub: "الشبكة",
      logout: "خروج",
      gateStatus: "أدخل الشِفرة للدخول",
      gateHint: "أربع خانات · شِفرة العضو فقط",
      gateWrong: "الشِفرة غير معروفة. حاول مجددًا.",
      revealEyebrow: "IDENTITY MATCH",
      revealLead: "تم التعرف عليك عبر شِفرتك الخاصة.",
      confirmQ: "هل هذه بياناتك؟",
      confirmYes: "نعم · ادخل النظام",
      confirmNo: "لا · إلغاء",
      session: "الجلسة",
      adminOpen: "لوحة التحكم",
      chatPlaceholder: "اكتب رسالة...",
      send: "إرسال",
      adminTitle: "لوحة التحكم",
      backChat: "← الشات",
      members: "الأعضاء",
      conversations: "المحادثات",
      fieldName: "الاسم",
      fieldPhone: "الجوال",
      fieldCity: "المدينة المسجّلة",
      fieldLiveLoc: "موقعك الحالي",
      fieldIp: "عنوان IP",
      fieldIsp: "الشبكة",
      locUnknown: "تعذر تحديد الموقع",
      fieldRole: "الرتبة",
      fieldCipher: "الشِفرة",
      roleAdmin: "الملك الأعلى",
      roleMember: "ملك",
      welcomeBot:
        "أهلاً سيدي. لقد تجاوزت الشِفرة.\nتم التعرف على هويتك ضمن الشبكة.\nأنت {name} · صاحب الشِفرة {code}.\nأنا رسول القناة. اكتب وسأرد عليك.",
      noConvos: "لا محادثات بعد.",
      you: "أنت",
      guardian: "VAULT://herald",
    },
    en: {
      brandSub: "NETWORK",
      logout: "Logout",
      gateStatus: "Enter your cipher to proceed",
      gateHint: "Four cells · member cipher only",
      gateWrong: "Unknown cipher. Try again.",
      revealEyebrow: "IDENTITY MATCH",
      revealLead: "You were recognized through your private cipher.",
      confirmQ: "Are these your details?",
      confirmYes: "Yes · enter system",
      confirmNo: "No · cancel",
      session: "SESSION",
      adminOpen: "Control panel",
      chatPlaceholder: "Type a message...",
      send: "Send",
      adminTitle: "CONTROL PANEL",
      backChat: "← Chat",
      members: "Members",
      conversations: "Conversations",
      fieldName: "Name",
      fieldPhone: "Phone",
      fieldCity: "Registered city",
      fieldLiveLoc: "Current location",
      fieldIp: "IP address",
      fieldIsp: "Network",
      locUnknown: "Location unavailable",
      fieldRole: "Rank",
      fieldCipher: "Cipher",
      roleAdmin: "High King",
      roleMember: "King",
      welcomeBot:
        "Welcome, sir. Cipher cleared.\nIdentity matched inside the network.\nYou are {name} · cipher holder {code}.\nI am the channel herald. Write and I will reply.",
      noConvos: "No conversations yet.",
      you: "You",
      guardian: "VAULT://herald",
    },
  };

  function t(lang, key) {
    return (STRINGS[lang] && STRINGS[lang][key]) || STRINGS.ar[key] || key;
  }

  function memberName(member, lang) {
    return lang === "en" ? member.nameEn : member.nameAr;
  }

  function memberCity(member, lang) {
    return lang === "en" ? member.cityEn : member.cityAr;
  }

  function defaultState() {
    return {
      members: JSON.parse(JSON.stringify(SEED_MEMBERS)),
      chats: {},
      lang: "ar",
    };
  }

  function loadState() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) {
        const s = defaultState();
        saveState(s);
        return s;
      }
      const parsed = JSON.parse(raw);
      if (!parsed.members || !parsed.members.length) {
        const s = defaultState();
        saveState(s);
        return s;
      }
      const merged = Object.assign(defaultState(), parsed);
      merged.members = (merged.members || []).map(function (m) {
        var seed = SEED_MEMBERS.find(function (s) {
          return s.id === m.id;
        });
        if (!seed) return m;
        return {
          id: seed.id,
          nameAr: seed.nameAr,
          nameEn: seed.nameEn,
          code: seed.code,
          role: seed.role,
          phone: seed.phone,
          cityAr: seed.cityAr,
          cityEn: seed.cityEn,
        };
      });
      SEED_MEMBERS.forEach(function (seed) {
        var exists = merged.members.some(function (m) {
          return m.id === seed.id;
        });
        if (!exists) merged.members.push(JSON.parse(JSON.stringify(seed)));
      });
      saveState(merged);
      return merged;
    } catch (e) {
      const s = defaultState();
      saveState(s);
      return s;
    }
  }

  function saveState(s) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(s));
  }

  function cloneMember(member) {
    return {
      id: member.id,
      nameAr: member.nameAr,
      nameEn: member.nameEn,
      code: member.code,
      role: member.role,
      phone: member.phone,
      cityAr: member.cityAr,
      cityEn: member.cityEn,
    };
  }

  function findByCode(s, code) {
    const normalized = String(code || "").trim().toUpperCase();
    var seed = SEED_MEMBERS.find(function (m) {
      return m.code.toUpperCase() === normalized;
    });
    if (seed) return cloneMember(seed);
    var extra = s.members.find(function (m) {
      return m.code.toUpperCase() === normalized;
    });
    return extra ? cloneMember(extra) : null;
  }

  function formatLiveLoc(live, lang) {
    if (!live || (!live.city && !live.region && !live.country)) {
      return t(lang, "locUnknown");
    }
    var parts = [live.city, live.region, live.country].filter(Boolean);
    var unique = [];
    parts.forEach(function (p) {
      if (unique.indexOf(p) === -1) unique.push(p);
    });
    return unique.join(" · ");
  }

  async function fetchLiveNet() {
    try {
      var res = await fetch("https://ipwho.is/?lang=en", { cache: "no-store" });
      var data = await res.json();
      if (data && data.success !== false && data.ip) {
        return {
          ip: data.ip,
          city: data.city || "",
          region: data.region || "",
          country: data.country || "",
          isp: (data.connection && data.connection.isp) || data.isp || "",
        };
      }
    } catch (e) {}
    try {
      var ipRes = await fetch("https://api.ipify.org?format=json", { cache: "no-store" });
      var ipData = await ipRes.json();
      return {
        ip: ipData.ip || "—",
        city: "",
        region: "",
        country: "",
        isp: "",
      };
    } catch (e2) {}
    return { ip: "—", city: "", region: "", country: "", isp: "" };
  }

  function getChat(s, memberId) {
    return s.chats[memberId] || [];
  }

  function appendChat(s, memberId, message) {
    if (!s.chats[memberId]) s.chats[memberId] = [];
    s.chats[memberId].push(Object.assign({}, message, { at: Date.now() }));
    saveState(s);
  }

  function maskPhone(phone, reveal) {
    reveal = reveal || 4;
    if (!phone) return "—";
    const digits = phone.replace(/\s/g, "");
    if (digits.length <= reveal + 3) return digits;
    const visible = digits.slice(-reveal);
    const head = digits.slice(0, Math.min(4, digits.length - reveal));
    const midLen = Math.max(0, digits.length - head.length - visible.length);
    return { head: head, midLen: midLen, visible: visible };
  }

  function sleep(ms) {
    return new Promise(function (r) {
      setTimeout(r, ms);
    });
  }

  async function typeInto(el, text, speed) {
    speed = speed || 22;
    el.textContent = "";
    el.classList.add("cursor-blink");
    for (var i = 0; i < text.length; i++) {
      el.textContent += text[i];
      await sleep(speed + Math.random() * 12);
    }
    el.classList.remove("cursor-blink");
  }

  async function typeLine(screenEl, text, cls) {
    var row = document.createElement("div");
    if (cls) row.className = cls;
    screenEl.appendChild(row);
    var out = "";
    for (var i = 0; i < text.length; i++) {
      out += text[i];
      var scramble = GLYPHS[Math.floor(Math.random() * GLYPHS.length)];
      row.textContent = out.slice(0, -1) + (i < text.length - 1 ? scramble : text[i]);
      await sleep(12 + Math.random() * 18);
      row.textContent = out;
    }
    screenEl.appendChild(document.createTextNode("\n"));
    screenEl.scrollTop = screenEl.scrollHeight;
  }

  async function runAccessSequence(screenEl, member, lang, onDone) {
    screenEl.innerHTML = "";
    var name = lang === "en" ? member.nameEn : member.nameAr;
    var lines = [
      { text: "> VAULT://access boot…", cls: "dim" },
      { text: "> handshake: cipher_channel_ok", cls: "ok" },
      { text: "> resolve_token(" + member.code + ")", cls: "" },
      { text: "> decrypting member vector…", cls: "dim" },
      { text: "> MATCH → " + name, cls: "ok" },
      { text: "> clearance: granted", cls: "ok" },
      { text: "> opening identity pane…", cls: "dim" },
    ];
    for (var i = 0; i < lines.length; i++) {
      await typeLine(screenEl, lines[i].text, lines[i].cls);
      await sleep(180 + Math.random() * 220);
    }
    await sleep(450);
    if (onDone) onDone();
  }

  function normalize(s) {
    return String(s || "")
      .trim()
      .toLowerCase()
      .replace(/[؟!.,]/g, " ");
  }

  function botReply(userText, member, lang) {
    var q = normalize(userText);
    var name = lang === "en" ? member.nameEn : member.nameAr;
    var isAdmin = member.role === "admin";

    if (!q) {
      return lang === "en" ? "Signal empty. Send a clear message." : "الإشارة فارغة. أرسل رسالة واضحة.";
    }
    if (/^(hi|hello|hey|السلام|مرحبا|هلا|اهلا|أهلًا|أهلا)/.test(q) || q.indexOf("سلام") !== -1) {
      return lang === "en"
        ? "Acknowledged, " + name + ". Channel is secure. How may I assist?"
        : "تم الاستلام، " + name + ". القناة مؤمّنة. كيف أساعدك؟";
    }
    if (q.indexOf("من انت") !== -1 || q.indexOf("who are you") !== -1 || q.indexOf("what are you") !== -1) {
      return lang === "en"
        ? "I am VAULT://herald — the channel voice for cipher holders. I reply with clarity, not noise."
        : "أنا VAULT://herald — رسول القناة لأصحاب الشِفر. أرد بوضوح، بلا ضجيج.";
    }
    if (
      q.indexOf("اي بي") !== -1 ||
      q.indexOf("ip") !== -1 ||
      q.indexOf("موقع") !== -1 ||
      q.indexOf("location") !== -1 ||
      q.indexOf("وين انا") !== -1
    ) {
      var live = sessionLive || {};
      var loc = formatLiveLoc(live, lang);
      return lang === "en"
        ? "This session IP is " + (live.ip || "—") + ". Current location: " + loc + "."
        : "آي بي هذه الجلسة: " + (live.ip || "—") + ". موقعك الحالي: " + loc + ".";
    }
    if (q.indexOf("شيفره") !== -1 || q.indexOf("شِفر") !== -1 || q.indexOf("cipher") !== -1 || q.indexOf("code") !== -1) {
      return lang === "en"
        ? "Your cipher is bound to this session only. Do not share it. Holder: " + name + "."
        : "شِفرتك مرتبطة بهذه الجلسة فقط. لا تشاركها. الحامل: " + name + ".";
    }
    if (q.indexOf("مساعد") !== -1 || q.indexOf("help") !== -1 || q.indexOf("ماذا") !== -1 || q.indexOf("what can") !== -1) {
      return lang === "en"
        ? "I can brief you on session status, remind protocol, and hold a calm conversation. Ask directly."
        : "أقدر أوضح حالة الجلسة، أذكّرك بالبروتوكول، وأحادثك بهدوء. اسأل مباشرة.";
    }
    if (q.indexOf("ادمن") !== -1 || q.indexOf("admin") !== -1 || q.indexOf("لوحة") !== -1 || q.indexOf("تحكم") !== -1) {
      if (isAdmin) {
        return lang === "en"
          ? "High King clearance confirmed. Open the control panel from the session side."
          : "صلاحية الملك الأعلى مؤكدة. افتح لوحة التحكم من جانب الجلسة.";
      }
      return lang === "en"
        ? "Control panel is reserved for the High King."
        : "لوحة التحكم مخصّصة للملك الأعلى فقط.";
    }
    if (q.indexOf("سر") !== -1 || q.indexOf("secret") !== -1 || q.indexOf("آمن") !== -1 || q.indexOf("secure") !== -1) {
      return lang === "en"
        ? "Privacy here depends on cipher discipline. Confirm identity only on this channel. Stay precise."
        : "السرية هنا تعتمد على ضبط الشِفرة. أكّد هويتك عبر هذه القناة فقط. كن دقيقًا.";
    }
    if (q.indexOf("وقت") !== -1 || q.indexOf("time") !== -1 || q.indexOf("تاريخ") !== -1 || q.indexOf("date") !== -1) {
      var now = new Date().toLocaleString(lang === "en" ? "en-GB" : "ar-SA");
      return lang === "en" ? "Channel clock: " + now : "ساعة القناة: " + now;
    }
    if (q.indexOf("شكر") !== -1 || q.indexOf("thanks") !== -1 || q.indexOf("thank") !== -1) {
      return lang === "en" ? "Understood. Standing by." : "حسنًا. أنا بالانتظار.";
    }
    if (lang === "en") {
      return (
        "Received, " +
        name +
        ". I logged your note on the channel.\nIf you need protocol, status, or a clear answer — ask in one sentence and I will respond accordingly."
      );
    }
    return (
      "تم الاستلام، " +
      name +
      ". سجّلت ملاحظتك على القناة.\nإذا تحتاج بروتوكول أو حالة أو جواب واضح — اكتب بجملة واحدة وسأرد وفقها."
    );
  }

  var state = loadState();
  var sessionMember = null;
  var sessionLive = null;
  var busy = false;

  function $(sel) {
    return document.querySelector(sel);
  }

  var views = {
    gate: $("#view-gate"),
    terminal: $("#view-terminal"),
    reveal: $("#view-reveal"),
    chat: $("#view-chat"),
    admin: $("#view-admin"),
  };

  function showView(name) {
    Object.keys(views).forEach(function (key) {
      views[key].classList.toggle("active", key === name);
    });
    $("#logoutBtn").classList.toggle("hidden", name === "gate" || name === "terminal");
  }

  function applyI18n() {
    var lang = state.lang;
    document.documentElement.lang = lang === "en" ? "en" : "ar";
    document.documentElement.dir = lang === "en" ? "ltr" : "rtl";
    $("#langToggle").textContent = lang === "ar" ? "EN" : "ع";

    document.querySelectorAll("[data-i18n]").forEach(function (el) {
      el.textContent = t(lang, el.getAttribute("data-i18n"));
    });
    document.querySelectorAll("[data-i18n-placeholder]").forEach(function (el) {
      el.setAttribute("placeholder", t(lang, el.getAttribute("data-i18n-placeholder")));
    });
  }

  function clearCipher() {
    document.querySelectorAll(".cipher-cell").forEach(function (c) {
      c.value = "";
    });
    var first = document.querySelector(".cipher-cell");
    if (first) first.focus();
  }

  function setupCipherInputs() {
    var cells = Array.prototype.slice.call(document.querySelectorAll(".cipher-cell"));
    cells.forEach(function (cell, idx) {
      cell.addEventListener("input", function () {
        cell.value = cell.value.slice(-1).toUpperCase().replace(/[^0-9A-Z]/g, "");
        $("#gateError").classList.add("hidden");
        if (cell.value && idx < cells.length - 1) cells[idx + 1].focus();
        if (cells.every(function (c) { return c.value; })) {
          submitCipher(cells.map(function (c) { return c.value; }).join(""));
        }
      });
      cell.addEventListener("keydown", function (e) {
        if (e.key === "Backspace" && !cell.value && idx > 0) {
          cells[idx - 1].focus();
          cells[idx - 1].value = "";
        }
        if (e.key === "Enter") {
          submitCipher(cells.map(function (c) { return c.value; }).join(""));
        }
      });
      cell.addEventListener("paste", function (e) {
        e.preventDefault();
        var text = (e.clipboardData.getData("text") || "")
          .toUpperCase()
          .replace(/[^0-9A-Z]/g, "")
          .slice(0, 4);
        text.split("").forEach(function (ch, i) {
          if (cells[i]) cells[i].value = ch;
        });
        if (text.length === 4) submitCipher(text);
        else if (text.length) cells[Math.min(text.length, 3)].focus();
      });
    });
    if (cells[0]) cells[0].focus();
  }

  async function submitCipher(code) {
    if (busy) return;
    if (code.length !== 4) return;

    var member = findByCode(state, code);
    var gate = $(".gate-stage");
    if (!member) {
      $("#gateError").textContent = t(state.lang, "gateWrong");
      $("#gateError").classList.remove("hidden");
      gate.classList.remove("shake");
      void gate.offsetWidth;
      gate.classList.add("shake");
      clearCipher();
      return;
    }

    busy = true;
    sessionMember = cloneMember(member);
    sessionLive = null;
    showView("terminal");
    var livePromise = fetchLiveNet();
    await runAccessSequence($("#termScreen"), sessionMember, state.lang, null);
    sessionLive = await livePromise;
    var locLine = formatLiveLoc(sessionLive, state.lang);
    await typeLine($("#termScreen"), "> source_ip: " + sessionLive.ip, "ok");
    await sleep(160);
    await typeLine($("#termScreen"), "> geo: " + locLine, "ok");
    await sleep(280);
    renderReveal(sessionMember);
    showView("reveal");
    busy = false;
  }

  function renderMaskedPhone(phone) {
    var masked = maskPhone(phone, 4);
    if (typeof masked === "string") return document.createTextNode(masked);
    var wrap = document.createElement("span");
    wrap.appendChild(document.createTextNode(masked.head));
    for (var i = 0; i < masked.midLen; i++) {
      var m = document.createElement("span");
      m.className = "mask";
      m.textContent = "░";
      wrap.appendChild(m);
    }
    wrap.appendChild(document.createTextNode(masked.visible));
    return wrap;
  }

  function renderReveal(member) {
    var lang = state.lang;
    $("#revealTitle").textContent = memberName(member, lang);
    var grid = $("#profileGrid");
    grid.innerHTML = "";

    var live = sessionLive || {};
    var rows = [
      [t(lang, "fieldName"), memberName(member, lang)],
      [t(lang, "fieldCipher"), member.code],
      [t(lang, "fieldRole"), member.role === "admin" ? t(lang, "roleAdmin") : t(lang, "roleMember")],
      [t(lang, "fieldCity"), memberCity(member, lang)],
      [t(lang, "fieldIp"), live.ip || "—"],
      [t(lang, "fieldLiveLoc"), formatLiveLoc(live, lang)],
    ];
    if (live.isp) {
      rows.push([t(lang, "fieldIsp"), live.isp]);
    }

    rows.forEach(function (pair) {
      var row = document.createElement("div");
      row.className = "profile-row";
      var key = document.createElement("span");
      key.className = "profile-key";
      key.textContent = pair[0];
      var val = document.createElement("span");
      val.className = "profile-val";
      val.textContent = pair[1];
      row.appendChild(key);
      row.appendChild(val);
      grid.appendChild(row);
    });

    if (member.phone) {
      var prow = document.createElement("div");
      prow.className = "profile-row";
      var pkey = document.createElement("span");
      pkey.className = "profile-key";
      pkey.textContent = t(lang, "fieldPhone");
      var pval = document.createElement("span");
      pval.className = "profile-val";
      pval.appendChild(renderMaskedPhone(member.phone));
      prow.appendChild(pkey);
      prow.appendChild(pval);
      grid.appendChild(prow);
    }
  }

  function appendMsgEl(role, text, animate) {
    var log = $("#chatLog");
    var el = document.createElement("div");
    el.className = "msg " + role;
    var who = document.createElement("span");
    who.className = "who";
    who.textContent = role === "bot" ? t(state.lang, "guardian") : t(state.lang, "you");
    el.appendChild(who);
    var body = document.createElement("div");
    el.appendChild(body);
    log.appendChild(el);
    log.scrollTop = log.scrollHeight;

    if (animate && role === "bot") {
      return typeInto(body, text, 16).then(function () {
        log.scrollTop = log.scrollHeight;
      });
    }
    body.textContent = text;
    return Promise.resolve();
  }

  async function enterChat() {
    if (!sessionMember) return;
    showView("chat");
    $("#sessionName").textContent = memberName(sessionMember, state.lang);
    $("#sessionMeta").textContent =
      sessionMember.code +
      " · " +
      (sessionMember.role === "admin" ? t(state.lang, "roleAdmin") : t(state.lang, "roleMember"));
    $("#adminOpen").classList.toggle("hidden", sessionMember.role !== "admin");

    var log = $("#chatLog");
    log.innerHTML = "";
    var history = getChat(state, sessionMember.id);

    if (!history.length) {
      var welcome = t(state.lang, "welcomeBot")
        .replace("{name}", memberName(sessionMember, state.lang))
        .replace("{code}", sessionMember.code);
      appendChat(state, sessionMember.id, { role: "bot", text: welcome, lang: state.lang });
      await appendMsgEl("bot", welcome, true);
    } else {
      history.forEach(function (msg) {
        appendMsgEl(msg.role === "bot" ? "bot" : "user", msg.text, false);
      });
      log.scrollTop = log.scrollHeight;
    }
  }

  async function handleUserMessage(text) {
    var clean = text.trim();
    if (!clean || !sessionMember || busy) return;
    busy = true;
    appendChat(state, sessionMember.id, { role: "user", text: clean });
    await appendMsgEl("user", clean, false);
    var reply = botReply(clean, sessionMember, state.lang);
    appendChat(state, sessionMember.id, { role: "bot", text: reply, lang: state.lang });
    await appendMsgEl("bot", reply, true);
    busy = false;
  }

  function renderAdmin() {
    var membersEl = $("#adminMembers");
    var convosEl = $("#adminConvos");
    membersEl.innerHTML = "";
    convosEl.innerHTML = "";

    state.members.forEach(function (m) {
      var card = document.createElement("div");
      card.className = "member-card";
      card.innerHTML =
        "<strong>" +
        memberName(m, state.lang) +
        "</strong><br/>" +
        t(state.lang, "fieldCipher") +
        ": " +
        m.code +
        "<br/>" +
        t(state.lang, "fieldRole") +
        ": " +
        (m.role === "admin" ? t(state.lang, "roleAdmin") : t(state.lang, "roleMember")) +
        "<br/>" +
        t(state.lang, "fieldCity") +
        ": " +
        memberCity(m, state.lang) +
        "<br/>" +
        (m.phone ? t(state.lang, "fieldPhone") + ": " + m.phone : "");
      membersEl.appendChild(card);
    });

    var ids = Object.keys(state.chats);
    if (!ids.length) {
      convosEl.textContent = t(state.lang, "noConvos");
      return;
    }

    ids.forEach(function (id) {
      var member = state.members.find(function (m) {
        return m.id === id;
      });
      var msgs = state.chats[id] || [];
      var card = document.createElement("div");
      card.className = "convo-card";
      var title = member ? memberName(member, state.lang) : id;
      var preview = msgs
        .slice(-8)
        .map(function (m) {
          return (m.role === "bot" ? "G" : "U") + ": " + m.text;
        })
        .join("\n\n");
      card.innerHTML = "<strong>" + title + "</strong><pre></pre>";
      card.querySelector("pre").textContent = preview;
      convosEl.appendChild(card);
    });
  }

  function logout() {
    sessionMember = null;
    sessionLive = null;
    busy = false;
    $("#profileGrid").innerHTML = "";
    $("#revealTitle").textContent = "";
    $("#chatLog").innerHTML = "";
    $("#sessionName").textContent = "";
    $("#sessionMeta").textContent = "";
    clearCipher();
    showView("gate");
  }

  function bindUi() {
    $("#langToggle").addEventListener("click", function () {
      state.lang = state.lang === "ar" ? "en" : "ar";
      saveState(state);
      applyI18n();
      if (sessionMember && views.reveal.classList.contains("active")) renderReveal(sessionMember);
      if (sessionMember && views.chat.classList.contains("active")) {
        $("#sessionName").textContent = memberName(sessionMember, state.lang);
        $("#sessionMeta").textContent =
          sessionMember.code +
          " · " +
          (sessionMember.role === "admin" ? t(state.lang, "roleAdmin") : t(state.lang, "roleMember"));
      }
      if (views.admin.classList.contains("active")) renderAdmin();
    });

    $("#logoutBtn").addEventListener("click", logout);
    $("#confirmYes").addEventListener("click", function () {
      enterChat();
    });
    $("#confirmNo").addEventListener("click", logout);

    $("#chatForm").addEventListener("submit", function (e) {
      e.preventDefault();
      var input = $("#chatInput");
      var val = input.value;
      input.value = "";
      handleUserMessage(val);
    });

    $("#adminOpen").addEventListener("click", function () {
      if (!sessionMember || sessionMember.role !== "admin") return;
      renderAdmin();
      showView("admin");
    });

    $("#adminBack").addEventListener("click", function () {
      showView("chat");
    });
  }

  applyI18n();
  setupCipherInputs();
  bindUi();
  showView("gate");
})();
