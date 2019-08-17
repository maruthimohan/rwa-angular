import { BrowserModule } from '@angular/platform-browser';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './components/app/app.component';
import { QuestionsComponent } from './components/questions/questions.component';
import { CategoriesComponent } from './components/categories/categories.component';
import { TagsComponent } from './components/tags/tags.component';
import { CategoryService, QuestionService, TagService } from './services';
import { HttpClientModule } from '@angular/common/http';

import { MaterialModule } from './material.module';
import { FlexLayoutModule } from '@angular/flex-layout';
import { QuestionAddUpdateComponent } from './components/question-add-update/question-add-update.component';

import 'hammerjs';
import { CustomSnackBarComponent } from './components/custom-snack-bar/custom-snack-bar.component';

@NgModule({
  declarations: [
    AppComponent,
    QuestionsComponent,
    CategoriesComponent,
    TagsComponent,
    QuestionAddUpdateComponent,
    CustomSnackBarComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,

    FormsModule,
    ReactiveFormsModule,

    HttpClientModule,
    HttpModule,
    AppRoutingModule,

    MaterialModule,
    FlexLayoutModule
  ],
  entryComponents: [
    CustomSnackBarComponent
  ],
  providers: [
    CategoryService, TagService, QuestionService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
