import { NgOptimizedImage } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({ selector: 'app-home', imports: [NgOptimizedImage, RouterLink], templateUrl: './home.html' })
export class Home {}
