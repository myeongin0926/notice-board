// 기본사항
let loggedUser = JSON.parse(localStorage.getItem("loggedUser"));
let isLoggedIn = JSON.parse(localStorage.getItem("isLoggedIn"));
let userList = JSON.parse(localStorage.getItem("userList"));
let isDarkMode = JSON.parse(localStorage.getItem("darkMode"));
// bodyclass
const bodyClass = document.body.classList;
//darkmode
const darkModeBtn = document.querySelector(".darkmode");
//guest-info
const guestInfo = document.querySelector(".guest-info");
//modal
const modalEl = document.querySelector(".modal");
const sideOpenBtnEl = document.querySelector(".sidebar-btn");
const findIdModalOpenBtnEl = document.querySelector(".find.btn");
//mypage
const userName = loggedUser?.[0]?.userName;
const userNumber = loggedUser?.[0]?.userNumber;
const userId = loggedUser?.[0]?.userId;
const modalOpenBtns = document.querySelectorAll(".modal-btns > .btn");
const sideEl = document.querySelector("aside.side-bar");
const myPageName = sideEl.querySelector(".mypage-name");
const myPageNumber = sideEl.querySelector(".mypage-number");
const myPageId = sideEl.querySelector(".mypage-id");
const logoutBtnEl = document.querySelector(".logout.btn");
const secessionBtnEl = document.querySelector(".secession.btn");
const passwordChangeBtnEl = document.querySelector(".change-password.btn");
//login
const loginFormEl = document.querySelector(".loginform");
const loginIdEl = document.querySelector(".login.id");
const loginPwEl = document.querySelector(".login.password");
const loginBtnEl = document.querySelector(".login.btn");
//find
const findIdFormEl = document.querySelector(".find-idform");
const findIdNameEl = document.querySelector(".find-id-name");
const findIdNumberEl = document.querySelector(".find-id-number");
const findIdBtnEl = document.querySelector(".find-id.btn");
const foundIdEl = document.querySelector(".found-id");

//signup
const signupFormEl = document.querySelector(".signupform");
const signupIdEl = document.querySelector(".signup.id");
const signupNameEl = document.querySelector(".signup.name");
const signupNumberEl = document.querySelector(".signup.phone-number");
const signupPwEl = document.querySelector(".signup.password");
const signupPwCheckEl = document.querySelector(".signup.password.check");
const signupBtnEl = document.querySelector(".signup.btn");

// 로그인 상태를 구분하여 화면 로드
if (isLoggedIn) {
  bodyClass.add("loggedin");
  myPageId.textContent = userId;
  myPageName.textContent = userName;
  myPageNumber.textContent = userNumber;
} else {
  guestInfo.classList.remove("hide");
}
// 다크모드를 구분하여 화면 로드
if (isDarkMode) {
  bodyClass.add("dark");
  darkModeBtn.textContent = bodyClass.contains("dark")
    ? "☀️ 라이트 모드"
    : "🌕  다크 모드";
} else {
  bodyClass.remove("dark");
}
// 유저 리스트가 없을 시 빈 배열을 넣어 저장
if (userList === null) {
  userList = [];
  localStorage.setItem("userList", JSON.stringify(userList));
}

// 다크모드 전환
darkModeBtn.addEventListener("click", () => {
  isDarkMode = isDarkMode === true ? false : true;
  localStorage.setItem("darkMode", JSON.stringify(isDarkMode));
  bodyClass.toggle("dark");
  darkModeBtn.textContent = bodyClass.contains("dark")
    ? "☀️ 라이트 모드"
    : "🌕  다크 모드";
});
// 로그인, 회원가입 창 띄우기
modalOpenBtns.forEach((e) => {
  e.addEventListener("click", (e) => {
    bodyClass.add(e.target.textContent.toLowerCase(), "show");
    e.target.textContent.toLowerCase() === "login"
      ? setTimeout(() => {
          loginIdEl.focus();
        }, 100)
      : setTimeout(() => {
          signupIdEl.focus();
        }, 100);
  });
});
// 흐릿한 배경을 클릭 했을 시에 작동 로직
modalEl.addEventListener("click", () => {
  bodyClass.remove("signup", "show", "login", "find-id");
  sideEl.classList.remove("open");
  foundIdEl.classList.remove("success");
  findIdNameEl.value = "";
  findIdNumberEl.value = "";
});

// 아이디찾기
findIdModalOpenBtnEl.addEventListener("click", () => {
  bodyClass.remove("login");
  bodyClass.add("find-id");
  setTimeout(() => {
    findIdNameEl.focus();
  }, 100);
});

// 로그인

loginFormEl.addEventListener("submit", (event) => {
  submitRenderPrevent(event);
  if (loginIdEl.value.length >= 5 && loginPwEl.value.length >= 8) {
    const testLogged = userList.filter(
      (e) => e.userId === loginIdEl.value && e.userPw === loginPwEl.value
    );

    if (testLogged.length) {
      bodyClass.remove("login", "show");
      bodyClass.add("loggedin");
      inputClear(loginIdEl, loginPwEl);
      localStorage.setItem("loggedUser", JSON.stringify(testLogged));
      localStorage.setItem("isLoggedIn", JSON.stringify(true));
      loggedUser = JSON.parse(localStorage.getItem("loggedUser"));
      myPageId.textContent = loggedUser[0].userId;
      myPageName.textContent = loggedUser[0].userName;
      myPageNumber.textContent = loggedUser[0].userNumber;
    } else {
      alert("아이디와 패스워드를 확인해주세요.");
      inputClear(loginPwEl);
      loginPwEl.focus();
    }
  } else {
    alert(" 아이디는 5 - 20자 비밀번호는 8자 이상을 입력해주세요 ");
    inputClear(loginIdEl, loginPwEl);
    loginIdEl.focus();
  }
});

// 회원가입 과정
let isAllValidated = false;
signupFormEl.addEventListener("submit", (event) => {
  signInComplete(event);
});

signupIdEl.addEventListener("input", () => {
  inputLengthCheck(signupIdEl, 5);
});

signupIdEl.addEventListener("change", () => {
  if (inputLengthCheck(signupIdEl, 5)) {
    if (userList.filter((e) => e.userId === signupIdEl.value).length > 0) {
      signupIdEl.classList.remove("input-success");
      alert("중복된 아이디가 존재합니다.");
      signupIdEl.value = "";
      signupIdEl.focus();
    }
  }
});

signupNameEl.addEventListener("input", () => {
  const regExp = new RegExp(/^[가-힣]{2,6}$/);
  inputExpressionCheck(regExp, signupNameEl);
});

signupNumberEl.addEventListener("input", () => {
  const regExp = new RegExp(/^010[0-9]{8}$/);
  inputExpressionCheck(regExp, signupNumberEl);
});

signupPwEl.addEventListener("input", () => {
  inputLengthCheck(signupPwEl, 8);
  if (signupPwEl.value.length < 8) {
    inputDisabled(signupPwCheckEl);
    signupPwCheckEl.value = "";
    inputError(signupPwCheckEl);
  } else inputDisabledUnlock(signupPwCheckEl);
});

signupPwCheckEl.addEventListener("input", () => {
  inputSameCheck(signupPwCheckEl, signupPwEl);
});

//아이디 찾기
findIdFormEl.addEventListener("submit", (event) => {
  submitRenderPrevent(event);
  const regExp = new RegExp(/^010[0-9]{8}$/);
  if (findIdNameEl.value.length >= 2 && regExp.test(findIdNumberEl.value)) {
    foundIdEl.classList.add("success");
    const foundIds = userList
      .filter(
        (e) =>
          e.userName === findIdNameEl.value &&
          e.userNumber === findIdNumberEl.value
      )
      .map((id) => {
        return id.userId;
      });

    if (foundIds.length) {
      foundIdEl.textContent = "";
      foundIds.forEach((id) => {
        const newEl = document.createElement("span");
        newEl.textContent = id;
        foundIdEl.appendChild(newEl);
        inputClear(findIdNameEl, findIdNumberEl);
      });
    } else {
      foundIdEl.textContent = "";
      foundIdEl.textContent = "존재하는 아이디가 없습니다.";
    }
  } else {
    foundIdEl.classList.remove("success");
    alert("이름과 전화번호를 확인해주세요.");
    findIdNameEl.focus();
  }
});

// 로그아웃
logoutBtnEl.addEventListener("click", () => {
  bodyClass.remove("loggedin", "show");
  sideEl.classList.remove("open");
  localStorage.setItem("loggedUser", JSON.stringify(null));
  localStorage.setItem("isLoggedIn", JSON.stringify(false));
  guestInfo.classList.remove("hide");
});

// 회원탈퇴
secessionBtnEl.addEventListener("click", () => {
  if (confirm("정말 회원을 탈퇴하시겠습니까?")) {
    userList = userList.filter((e) => loggedUser[0].userId !== e.userId);
    localStorage.setItem("userList", JSON.stringify(userList));
    bodyClass.remove("loggedin", "show");
    sideEl.classList.remove("open");
    localStorage.setItem("loggedUser", JSON.stringify(null));
    localStorage.setItem("isLoggedIn", JSON.stringify(false));
    guestInfo.classList.remove("hide");
    alert("회원탈퇴가 정상적으로 이루어졌습니다.");
  }
});
// 비밀번호 변경
passwordChangeBtnEl.addEventListener("click", () => {
  const nowPass = prompt("현재 비밀번호를 입력해주세요.");
  if (nowPass) {
    if (nowPass === loggedUser[0].userPw) {
      let newPw = prompt("새로운 비밀번호");
      if (newPw) {
        if (loggedUser[0].userPw === newPw) {
          alert("이전과 다른 비밀번호를 설정해주세요");
        } else if (newPw?.length < 8) {
          alert("비밀번호는 8자 이상이여야 합니다");
        } else {
          const pwCheck = prompt("비밀번호 확인");
          if (newPw === pwCheck) {
            const newUserList = userList.filter(
              (e) => loggedUser[0].userId !== e.userId
            );
            const newUser = { ...loggedUser[0], userPw: newPw };
            newUserList.push(newUser);
            localStorage.setItem("loggedUser", JSON.stringify([newUser]));
            loggedUser = JSON.parse(localStorage.getItem("loggedUser"));
            localStorage.setItem("userList", JSON.stringify(newUserList));
            userList = newUserList;
            alert("비밀번호 변경이 완료되었습니다.");
          } else {
            alert("비밀번호 재확인이 일치하지 않습니다.");
          }
        }
      }
    } else {
      alert("비밀번호가 일치하지 않습니다.");
    }
  }
});
//사이드바 오픈
sideOpenBtnEl.addEventListener("click", () => {
  bodyClass.add("show");
  sideEl.classList.toggle("open");
});
window.addEventListener("keydown", (e) => {
  if (e.code === "Escape") {
    console.log(userList);
    console.log(userList);
  }
});
// function
function submitRenderPrevent(event) {
  event.preventDefault();
}

function inputSameCheck(changeEl, sameEl) {
  if (changeEl.value === sameEl.value) {
    inputSuccess(changeEl);
    return true;
  } else {
    inputError(changeEl);
  }
}
function inputExpressionCheck(regExp, el) {
  if (regExp.test(el.value)) {
    inputSuccess(el);
    return true;
  } else {
    inputError(el);
  }
}
function inputLengthCheck(el, length) {
  if (el.value.length < length) {
    inputError(el);
  } else {
    inputSuccess(el);
    return true;
  }
}

function inputError(el) {
  if (el.value.length === 0) {
    el.classList.remove("input-success", "input-error");
  } else {
    el.classList.remove("input-success");
    el.classList.add("input-error");
  }
}
function inputSuccess(el) {
  if (el.value.length === 0) {
    el.classList.remove("input-success", "input-error");
  } else {
    el.classList.remove("input-error");
    el.classList.add("input-success");
  }
}
function inputDisabledUnlock(el) {
  el.classList.remove("disabled");
  el.removeAttribute("disabled");
}
function inputDisabled(el) {
  el.classList.add("disabled");
  el.setAttribute("disabled", "");
}
function inputClear(...els) {
  els.forEach((el) => {
    el.value = "";
    inputSuccess(el);
  });
}
function signInComplete() {
  submitRenderPrevent(event);
  if (
    inputLengthCheck(signupIdEl, 5) &&
    inputExpressionCheck(new RegExp(/^[가-힣]{2,6}$/), signupNameEl) &&
    inputExpressionCheck(new RegExp(/^010[0-9]{8}$/), signupNumberEl) &&
    inputLengthCheck(signupPwEl, 8) &&
    inputSameCheck(signupPwCheckEl, signupPwEl)
  ) {
    alert(`${signupNameEl.value}님의 회원가입을 축하합니다.`);
    userList.push({
      userId: signupIdEl.value,
      userName: signupNameEl.value,
      userNumber: signupNumberEl.value,
      userPw: signupPwEl.value,
    });
    localStorage.setItem("userList", JSON.stringify(userList));
    inputClear(
      signupFormEl,
      signupIdEl,
      signupNameEl,
      signupNumberEl,
      signupPwEl,
      signupPwCheckEl,
      loginIdEl,
      loginPwEl
    );
    bodyClass.remove("signup");
    bodyClass.add("login");
    setTimeout(() => {
      loginIdEl.focus();
    }, 100);
  } else {
    alert("올바른 형식으로 작성해주세요.");
  }
}
