import { NgModule } from '@angular/core';
import { ClarityModule,ClrFormsNextModule } from '@clr/angular';
import { CommonModule } from '@angular/common';
import { FormsModule }   from '@angular/forms';
import { CoreModule } from '../core/core.module';

import { AreasComponent } from './components/areas.component';
import { AreaDetailsComponent } from './components/area-details/area-details.component';
import { AreaService } from './services/area.service';
import { DurationMinutesPipe } from './pipes/duration-minutes.pipe';

@NgModule({
  imports: [
    CommonModule,
    ClarityModule,
    ClrFormsNextModule,
    FormsModule,
    CoreModule
  ],
  declarations: [
    AreasComponent,
    AreaDetailsComponent,
    DurationMinutesPipe
  ],
  providers: [AreaService]
})
export class AreasModule { }
