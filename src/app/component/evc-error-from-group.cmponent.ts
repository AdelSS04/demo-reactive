import { ChangeDetectionStrategy, Component, computed, inject, Input, Signal, signal } from '@angular/core';
import { EvcError, EvcErrorsAvecCle } from '../input/evc-erreur';
import { FgServiceService } from '../services/fg-service.service';

@Component({
  selector: 'app-error-list',
  standalone: true,
  changeDetection : ChangeDetectionStrategy.OnPush,
  template: `
    @if(errors().length > 0){
    <div class="error-list">
      @for(error of errors();  track error.cleErreur ){
      <div class="error-item">
        <span class="error-key">{{ error.cleErreur }}:</span>
        <span class="error-message">{{ error.message }}</span>
      </div>
      }
    </div>
    }
  `,
  styles: [
    `
      .error-list {
        margin: 1rem 0;
        padding: 0;
        list-style: none;
      }

      .error-item {
        display: flex;
        align-items: center;
        margin-bottom: 0.5rem;
        padding: 0.5rem;
        border: 1px solid red;
        border-radius: 4px;
        background-color: #ffe6e6;
      }

      .error-key {
        font-weight: bold;
        margin-right: 0.5rem;
      }

      .error-message {
        color: red;
      }
    `,
  ],
})
export class ErrorListComponent {
  errors :Signal<EvcErrorsAvecCle[]> ;
  groupService = inject(FgServiceService);

  /**
   *
   */
  constructor() {
    this.errors = computed(() =>
      this.convertMapToEvcErreurAvecCleArray(
        this.groupService.erreursunitaire()
      )
    );
  }
  convertMapToEvcErreurAvecCleArray(
    map: Map<string, EvcError>
  ): EvcErrorsAvecCle[] {
    const result: EvcErrorsAvecCle[] = [];
    map.forEach((value, key) => {
      result.push({ ...value, cleErreur: key });
    });
    return result;
  }
}
