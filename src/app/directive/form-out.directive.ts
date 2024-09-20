import { Directive, HostListener, Inject } from '@angular/core';
import { OUR_FORM, canOutForm } from '../guards/form-out.guard';

@Directive({
  standalone: true
})
export class OutFormDirective {
  constructor(@Inject(OUR_FORM) private component: canOutForm) {}

  @HostListener('window:beforeunload')
  onBeforeUnload(event: BeforeUnloadEvent): boolean {
    return !this.component.form.dirty
  }
}
