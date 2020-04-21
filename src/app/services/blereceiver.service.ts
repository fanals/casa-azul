import { Injectable } from '@angular/core';
import { OrdersService } from './orders.service';
import { TablesService } from './tables.service';
import { PacketType, ChunkType, ServicesEnum } from '../types';
import { ConsoleService } from './console.service';
import { BluetoothLE } from '@ionic-native/bluetooth-le/ngx';

@Injectable({
  providedIn: 'root'
})
export class BlereceiverService {

  public packetChunks = [];

  constructor(public bluetoothle: BluetoothLE,
              public ordersService: OrdersService,
              public console: ConsoleService,
              public tablesService: TablesService) {}

  public receivedChunk(chunk) {
    let bytes = this.bluetoothle.encodedStringToBytes(chunk);
    let text = this.bluetoothle.bytesToString(bytes);
    let dataChunk: ChunkType = JSON.parse(text);
    this.packetChunks.push(dataChunk.chunk);
    if (dataChunk.completed) {
      let packet:PacketType = JSON.parse(this.packetChunks.join(''));
      this.packetChunks = [];
      this._receivedPacket(packet);
    }
  }

  private _receivedPacket(packet: PacketType) {
    this.console.log('Received data', packet);
    if (packet.s == ServicesEnum['Batch']) {
      this.tablesService.addTableOrder(packet.d);
    } else if (packet.s == ServicesEnum['Order']) {
      this.ordersService.add(packet.d);
    } else {
      alert('Received unknow service: '+packet.s);
    }
  }

}
