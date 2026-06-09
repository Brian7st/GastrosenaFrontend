import '@angular/compiler';
import { getTestBed } from '@angular/core/testing';
import {
  BrowserTestingModule,
  platformBrowserTesting,
} from '@angular/platform-browser/testing';

// Angular 20 ya no expone platform-browser-dynamic/testing; inicializamos el
// TestBed con la API moderna de @angular/platform-browser/testing.
getTestBed().initTestEnvironment(BrowserTestingModule, platformBrowserTesting(), {
  errorOnUnknownElements: true,
  errorOnUnknownProperties: true,
});
