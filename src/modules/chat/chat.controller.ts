import { Controller, Post, Body } from '@nestjs/common';
import { ChatService } from './chat.service';
import { ChatRequestDto } from './chat.dto';
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';
import { CustomApiResponse as CustomApiResponse } from '../../common/helpers/http.helper';
import { ErrorResponse, SuccessResponse } from 'src/common/model/dto/response.dto';

@ApiTags('Chat')
@Controller('chat')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Post()
  @ApiOperation({ summary: 'Send a chat message' })
  @ApiResponse({ status: 200, description: 'Chat message sent successfully.' })
  @ApiResponse({ status: 400, description: 'Bad Request. Invalid chat message format.' })
  @ApiResponse({ status: 500, description: 'Internal Server Error. Could not process the chat message.' })
  @ApiBody({ type: ChatRequestDto })
  async sendChat(@Body() chatRequest: ChatRequestDto) {
    try {
      const response = await this.chatService.ask(chatRequest);
      return CustomApiResponse.success(response, 'Chat message sent successfully', 200);
    } catch (error) {
      return CustomApiResponse.error('Internal Server Error. Could not process the chat message.', 500, 'CHAT_PROCESSING_ERROR');
    }
  }
}
