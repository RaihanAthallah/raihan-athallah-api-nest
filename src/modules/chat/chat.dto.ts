import { ApiProperty } from '@nestjs/swagger';

export class ChatRequestDto {
  @ApiProperty({
    description: 'The message to be sent in the chat',
    example: 'Hello, how can I help you today?',
  })
  message: string;
}

export class ChatResponseDto<T = string> {
  @ApiProperty({
    description: 'The response message from the chat service',
    example: 'Hello! How can I assist you today?',
  })
  response: string;

  constructor(response: T) {
    this.response = response as string;
  }
}
