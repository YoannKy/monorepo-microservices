import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { ConcertsGatewayController } from './concerts-gateway/controllers/concerts-gateway.controller';
import { ConcertsGatewayService } from './concerts-gateway/services/concerts-gateway.service';
import { TransformParamsPipe } from './concerts-gateway/pipes/concerts-gateway.pipe';

@Module({
  imports: [ConfigModule.forRoot()],
  controllers: [ConcertsGatewayController],
  providers: [ConcertsGatewayService, TransformParamsPipe],
})
export class ConcertsGatewayModule {}
