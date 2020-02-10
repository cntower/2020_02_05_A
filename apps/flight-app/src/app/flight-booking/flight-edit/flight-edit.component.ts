import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import { pluck, switchMap, map } from 'rxjs/operators';
import { FlightBookingAppState, flightBookingFeatureKey } from '../+state/flight-booking.reducer';
import { Store } from '@ngrx/store';
import { loadFlight } from '../+state/flight-booking.actions';
import { combineLatest } from 'rxjs';

@Component({
  selector: 'app-flight-edit',
  templateUrl: './flight-edit.component.html'
})
export class FlightEditComponent implements OnInit {
  id: string;
  showDetails: string;
  showWarning = false;

  flight$ = this.store.select(s => s[flightBookingFeatureKey].current);

  constructor(
    private route: ActivatedRoute,
    private store: Store<FlightBookingAppState>
    ) {
  }

  ngOnInit() {
    this.route.params.subscribe(p => {
      this.id = p['id'];
      this.showDetails = p['showDetails'];

      this.store.dispatch(loadFlight({ id: this.id }));
    });
  }

  decide(decision: boolean) {
  }

}
