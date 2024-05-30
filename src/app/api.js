import { toast } from "react-toastify";

export async function getBook() {
  const response = await fetch(`/api/book`);
  const data = await response.json();
  return data;
}

export async function getBookPage(page) {
  const response = await fetch(`/api/book/page/${page}`);
  const data = await response.json();
  return data;
}

export async function fetchSearchBook(searchBook) {
  const response = await fetch(`/api/search/${searchBook}`);
  const data = await response.json();
  return data;
}

export async function fetchSearchUser(searchUser) {
  const response = await fetch(`/api/search/${searchUser}/user`);
  const data = await response.json();
  return data;
}

export async function fetchSearchCreateBook(searchBook) {
  const response = await fetch(`/api/search/${searchBook}/createbook`);
  const data = await response.json();
  return data;
}

export async function fetchBookPost(token, body) {
  const response = await fetch(`/api/book`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    method: "POST",
    body: JSON.stringify(body),
  });

  const data = await response.json();
  return data;
}

export async function fetchBookId(bookId) {
  const response = await fetch(`/api/book/${bookId}`);
  const data = await response.json();
  return data;
}

export async function fetchDeleteBook(token, bookId) {
  await fetch(`/api/book/${bookId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    method: "DELETE",
  });
}

export async function fetchUpdateBook(token, bookId, body) {
  const response = await fetch(`/api/book/${bookId}`, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    method: "PUT",
    body: JSON.stringify(body),
  });

  const data = await response.json();
  return data;
}

export async function fetchProfileBook(userId) {
  const response = await fetch(`/api/book/profile/${userId}`);
  const data = await response.json();
  return data;
}

export async function fetchAllProfile() {
  const response = await fetch(`/api/profile`);
  const data = await response.json();
  return data;
}

export async function fetchProfile(userId) {
  const response = await fetch(`/api/profile/${userId}`);
  const data = await response.json();
  return data;
}

export async function fetchComment(bookId) {
  const response = await fetch(`/api/comment/${bookId}`);
  const data = await response.json();
  return data;
}

export async function fetchCommentPost(token, body) {
  const response = await fetch(`/api/comment`, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    method: "POST",
    body: JSON.stringify(body),
  });

  const data = await response.json();

  return data;
}

export async function fetchDeleteComment(token, commentId) {
  await fetch(`/api/comment/${commentId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    method: "DELETE",
  });
}

export async function fetchProfilesAll() {
  const response = await fetch("/api/register");
  const data = await response.json();
  return data;
}

export async function fetchBookComment(body) {
  const response = await fetch("/api/bookComment", {
    method: "POST",
    body: body,
  });
  const data = await response.json();
  return data;
}

export async function fetchGetBookComment(bookId) {
  const response = await fetch(`/api/bookComment/${bookId}`);
  const data = response.json();
  return data;
}

export async function fetchProfileBookPage(userId, page) {
  const response = await fetch(`/api/book/profile/${userId}/${page}`);
  const data = await response.json();
  return data;
}

export async function updateUser(body) {
  const response = await fetch(`/api/user/${body.id}`, {
    headers: {
      "Content-Type": "application/json",
    },
    method: "PUT",
    body: JSON.stringify(body),
  });

  const data = await response.json();
  return data;
}

export async function fetchUserWithMail(email, password) {
  const response = await fetch(`/api/user/getUserWithMail`, {
    headers: {
      "Content-Type": "application/json",
    },
    method: "POST",
    body: JSON.stringify({ email, password }),
  });

  const data = await response.json();
  return data;
}

export async function sendVerifyMail(email, id) {
  const response = await fetch(`/api/auth/sendVerifyMail`, {
    headers: {
      "Content-Type": "application/json",
    },
    method: "POST",
    body: JSON.stringify({ email, id }),
  });

  if (response.status === 200) {
    toast.success("Mail has been sent!");
  } else {
    toast.error("Error occured while sending mail");
  }
}

export async function sendForgotPasswordMail(email) {
  const response = await fetch(`/api/auth/forgotPassword`, {
    headers: {
      "Content-Type": "application/json",
    },
    method: "POST",
    body: JSON.stringify({ email }),
  });
  const data = await response.json();
  if (response.status === 200) {
    toast.success(data);
  } else {
    toast.error(data ?? "Error occured while sending mail");
  }
}

export async function checkResetPasswordToken(resetPasswordToken) {
  const response = await fetch(`/api/auth/checkResetPasswordToken`, {
    headers: {
      "Content-Type": "application/json",
    },
    method: "POST",
    body: JSON.stringify({ resetPasswordToken }),
  });

  console.log(response.status);

  return response.status === 200;
}

export async function resetPassword(resetPasswordToken, newPassword) {

  const response = await fetch(`/api/auth/resetPassword`, {
    headers: {
      "Content-Type": "application/json",
    },
    method: "POST",
    body: JSON.stringify({ resetPasswordToken, newPassword }),
  });

  if (response.status === 200) {
    toast.success("Password reset successful");
  } else {
    toast.error("Invalid token");
  }
}