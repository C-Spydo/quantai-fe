import { Injectable } from '@angular/core';
import { HttpInterceptorFn, HttpRequest, HttpHandler } from '@angular/common/http';


export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const token = localStorage.getItem('tubenotes_token');
  const isAuthRequest = req.url.includes('/api/auth/google'); // Skip auth header for login

  if (token && !isAuthRequest) {
    const modifiedReq = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
    return next(modifiedReq);
  }

  return next(req);
};

