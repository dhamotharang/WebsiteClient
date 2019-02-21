/**
 * Created by HoangIT21 on 7/4/2017.
 */
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Holiday } from './holiday/holiday.model';
import { Shift } from './shift/timekeeping-shift.model';
import { ShiftGroup } from './shift/shift-group.model';
import { Machine } from './machine/machine.model';

@Injectable()
export class TimekeepingConfigService {
    url = 'timekeeping-config/';

    constructor(private http: HttpClient) {
    }

    // BEGIN: Timekeeping Config Holidays
    insertHoliday(holiday: Holiday) {
        return this.http.post(`${this.url}insert-holiday`, holiday);
    }

    updateHoliday(holiday: Holiday) {
        return this.http.post(`${this.url}update-holiday`, holiday);
    }

    searchAllHoliday(year: number) {
        return this.http.get(`${this.url}search-all-holiday`, {
            params: new HttpParams()
                .set('year', year.toString())
        });
    }

    deleteHoliday(id: string) {
        return this.http.delete(`${this.url}delete-holiday`, {
            params: new HttpParams().set('id', id)
        });
    }

    // END: Timekeeping Config Holidays

    // BEGIN: Timekeeping Config Shift
    insertShift(shift: Shift) {
        return this.http.post(`${this.url}insert-shift`, shift);
    }

    updateShift(shift: Shift) {
        return this.http.post(`${this.url}update-shift`, shift);
    }

    deleteShift(shiftId: string) {
        return this.http.delete(`${this.url}delete-shift`, {
            params: new HttpParams().set('id', shiftId)
        });
    }

    searchAllShift() {
        return this.http.get(`${this.url}search-all-shift`);
    }

    insertShiftGroup(shiftGroup: ShiftGroup) {
        return this.http.post(`${this.url}insert-shift-group`, shiftGroup);
    }

    updateShiftGroup(shiftGroup: ShiftGroup) {
        return this.http.post(`${this.url}update-shift-group`, shiftGroup);
    }

    updateShiftGroupActive(groupId: string, isActive: boolean) {
        return this.http.post(`${this.url}update-shift-group-active`, groupId, {
            params: new HttpParams()
                .set('isActive', isActive.toString())
        });
    }

    deleteShiftGroup(shiftGroupId: string) {
        return this.http.delete(`${this.url}delete-shift-group`, {
            params: new HttpParams()
                .set('id', shiftGroupId)
        });
    }

    searchAllShiftGroup() {
        return this.http.get<ShiftGroup[]>(`${this.url}search-all-shift-group`);
    }

    searchAllShiftGroupActive() {
        return this.http.get(`${this.url}search-all-shift-group-active`);
    }


    getMyShift() {
        return this.http.get(`${this.url}get-my-shift`);
    }

    searchMachine() {
        return this.http.get(`${this.url}search-machine`);
    }

    insertMachine(machine: Machine) {
        return this.http.post(`${this.url}insert-machine`, machine);
    }

    updateMachine(machine: Machine) {
        return this.http.post(`${this.url}update-machine`, machine);
    }

    deleteMachine(machineId: string) {
        return this.http.delete(`${this.url}delete-machine`, {
            params: new HttpParams().set('machineId', machineId)
        });
    }

    getSerial(ip: string, port: number) {
        return this.http.get(`${this.url}get-serial-number`, {
            params: new HttpParams()
                .set('ip', ip.toString())
                .set('port', port.toString())
        });
    }

    // END: Timekeeping machine

    // BEGIN: Timekeeping general config
    saveGeneral(maxInOutMin: number, maxInOutTimes: number) {
        return this.http.post(`${this.url}save-general`, {
            maxInOutMin: maxInOutMin,
            maxInOutTimes: maxInOutTimes
        });
    }

    getGeneralConfig() {
        return this.http.get<any>(`${this.url}get-general-config`);
    }

    // END: Timekeeping general config
}
