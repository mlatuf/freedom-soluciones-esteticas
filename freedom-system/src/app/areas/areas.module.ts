import { NgModule } from '@angular/core';
import { ClarityModule } from '@clr/angular';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule }   from '@angular/forms';
import { MatTableModule, MatFormFieldModule, MatPaginatorModule, MatSortModule, MatIconModule, MatButtonModule, MatSnackBarModule } from '@angular/material';
import { CoreModule } from '../core/core.module';

import { AreasComponent } from './components/areas.component';
import { AreaDetailsComponent } from './components/area-details/area-details.component';
import { AreaService } from './services/area.service';
import { DurationMinutesPipe } from './pipes/duration-minutes.pipe';
import { AngularFireAuthGuard } from '@angular/fire/auth-guard';

@NgModule({
  imports: [
    CommonModule,
    ClarityModule,
    FormsModule,
    ReactiveFormsModule,
    CoreModule,
    MatTableModule,
    MatFormFieldModule,
    MatPaginatorModule,
    MatSortModule,
    MatIconModule,
    MatButtonModule,
    MatSnackBarModule
  ],
  declarations: [
    AreasComponent,
    AreaDetailsComponent,
    DurationMinutesPipe
  ],
  providers: [AreaService, AngularFireAuthGuard]
})
export class AreasModule { }
