import { ChangeDetectionStrategy, Component, computed, inject, Input, Signal, signal } from '@angular/core';
import { FormError, FormErrorWithKey } from '../form-group/form-error-types';
import { FormGroupService } from '../core/services/form-group.service';

/**
 * Component for displaying form validation errors in a consistent format.
 * Automatically integrates with the FormGroupService to show all form errors.
 *
 * @example
 * ```html
 * <app-error-list></app-error-list>
 * ```
 */
@Component({
  selector: 'app-error-list',
  standalone: true,
  changeDetection : ChangeDetectionStrategy.OnPush,
  template: `
    @if(errors().length > 0){
    <div class="error-list">
      @for(error of errors();  track error.errorKey ){
      <div class="error-item">
        <span class="error-key">{{ error.errorKey }}:</span>
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
  /** Signal containing all form validation errors */
  errors :Signal<FormErrorWithKey[]> ;

  /** Injected form group service for error management */
  groupService = inject(FormGroupService);

  /**
   * Initializes the component and sets up error tracking.
   * Automatically converts the error map from the service to an array for template usage.
   */
  constructor() {
    this.errors = computed(() =>
      this.convertMapToFormErrorArray(
        this.groupService.getFormErrors()
      )
    );
  }

  /**
   * Converts a Map of form errors to an array format for template usage.
   *
   * @param map - Map containing validation errors
   * @returns Array of errors with their corresponding keys
   */
  convertMapToFormErrorArray(
    map: Map<string, FormError>
  ): FormErrorWithKey[] {
    const result: FormErrorWithKey[] = [];
    map.forEach((value, key) => {
      result.push({ ...value, errorKey: key });
    });
    return result;
  }
}
